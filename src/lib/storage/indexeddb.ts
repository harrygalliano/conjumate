const DB_NAME = 'conjumate';
const DB_VERSION = 1;

export const STORE_NAMES = ['lessons', 'progress', 'settings'] as const;
export type StoreName = (typeof STORE_NAMES)[number];

let dbPromise: Promise<IDBDatabase> | null = null;

const openDb = () => {
	if (dbPromise) return dbPromise;

	dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
		if (typeof indexedDB === 'undefined') {
			reject(new Error('IndexedDB is not available in this environment.'));
			return;
		}

		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onupgradeneeded = () => {
			const db = request.result;
			STORE_NAMES.forEach((store) => {
				if (!db.objectStoreNames.contains(store)) {
					db.createObjectStore(store);
				}
			});
		};

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'));
	});

	return dbPromise;
};

const withStore = async <T>(
	storeName: StoreName,
	mode: IDBTransactionMode,
	action: (store: IDBObjectStore) => IDBRequest<T>
) => {
	const db = await openDb();
	return new Promise<T>((resolve, reject) => {
		const transaction = db.transaction(storeName, mode);
		const store = transaction.objectStore(storeName);
		const request = action(store);

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
	});
};

export const dbGet = <T = unknown>(storeName: StoreName, key: IDBValidKey) =>
	withStore<T | undefined>(storeName, 'readonly', (store) => store.get(key));

export const dbSet = <T = unknown>(storeName: StoreName, key: IDBValidKey, value: T) =>
	withStore(storeName, 'readwrite', (store) => store.put(value, key));

export const dbDelete = (storeName: StoreName, key: IDBValidKey) =>
	withStore(storeName, 'readwrite', (store) => store.delete(key));

export const dbClear = (storeName: StoreName) =>
	withStore(storeName, 'readwrite', (store) => store.clear());

export const dbGetAll = <T = unknown>(storeName: StoreName) =>
	withStore<T[]>(storeName, 'readonly', (store) => store.getAll());

export const dbGetAllKeys = (storeName: StoreName) =>
	withStore<IDBValidKey[]>(storeName, 'readonly', (store) => store.getAllKeys());

export const dbBulkSet = async <T = unknown>(
	storeName: StoreName,
	entries: Array<[IDBValidKey, T]>
) => {
	const db = await openDb();
	return new Promise<void>((resolve, reject) => {
		const transaction = db.transaction(storeName, 'readwrite');
		const store = transaction.objectStore(storeName);

		entries.forEach(([key, value]) => store.put(value, key));

		transaction.oncomplete = () => resolve();
		transaction.onerror = () =>
			reject(transaction.error ?? new Error('IndexedDB bulk write failed'));
	});
};

export const dbUpdate = async <T = unknown>(
	storeName: StoreName,
	key: IDBValidKey,
	updater: (current: T | undefined) => T
) => {
	const current = await dbGet<T>(storeName, key);
	return dbSet(storeName, key, updater(current));
};
