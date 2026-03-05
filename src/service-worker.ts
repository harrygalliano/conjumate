/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

const APP_CACHE = `app-cache-${version}`;
const RUNTIME_CACHE = `runtime-cache-${version}`;
const API_CACHE = `api-cache-${version}`;
const MEDIA_CACHE = `media-cache-${version}`;

const ASSETS = [...build, ...files];

const cacheFirst = async (request: Request, cacheName: string) => {
	const cache = await caches.open(cacheName);
	const cached = await cache.match(request);
	if (cached) return cached;

	const response = await fetch(request);
	if (response.ok) cache.put(request, response.clone());
	return response;
};

const networkFirst = async (request: Request, cacheName: string) => {
	const cache = await caches.open(cacheName);
	try {
		const response = await fetch(request);
		if (response.ok) cache.put(request, response.clone());
		return response;
	} catch {
		const cached = await cache.match(request);
		if (cached) return cached;
		throw new Error('Network and cache failed');
	}
};

const staleWhileRevalidate = async (request: Request, cacheName: string) => {
	const cache = await caches.open(cacheName);
	const cached = await cache.match(request);
	const fetchPromise = fetch(request)
		.then((response) => {
			if (response.ok) cache.put(request, response.clone());
			return response;
		})
		.catch(() => undefined);

	return cached ?? (await fetchPromise);
};

self.addEventListener('install', (event) => {
	self.skipWaiting();
	event.waitUntil(
		caches.open(APP_CACHE).then((cache) => cache.addAll(ASSETS))
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(
				keys
					.filter((key) => ![APP_CACHE, RUNTIME_CACHE, API_CACHE, MEDIA_CACHE].includes(key))
					.map((key) => caches.delete(key))
			);
			await self.clients.claim();
		})()
	);
});

self.addEventListener('fetch', (event) => {
	const { request } = event;
	if (request.method !== 'GET') return;

	const url = new URL(request.url);
	if (url.origin !== self.location.origin) return;

	// Static assets from build - serve from cache
	if (ASSETS.includes(url.pathname)) {
		event.respondWith(
			caches.open(APP_CACHE).then((cache) => 
				cache.match(url.pathname).then((response) => response ?? fetch(request))
			)
		);
		return;
	}

	// Navigation requests - cache first for offline support
	if (request.mode === 'navigate') {
		event.respondWith(
			(async () => {
				try {
					// Try network first
					const response = await fetch(request);
					// Cache the page for offline use
					const cache = await caches.open(RUNTIME_CACHE);
					cache.put(request, response.clone());
					return response;
				} catch {
					// Network failed - try cache
					const cached = await caches.match(request);
					if (cached) return cached;
					// Fall back to cached home page as app shell
					const fallback = await caches.match('/');
					if (fallback) return fallback;
					// Last resort - return any cached page
					const cache = await caches.open(RUNTIME_CACHE);
					const keys = await cache.keys();
					if (keys.length > 0) {
						const any = await cache.match(keys[0]);
						if (any) return any;
					}
					return new Response('Offline', { status: 503 });
				}
			})()
		);
		return;
	}

	if (url.pathname.startsWith('/api/') || request.headers.get('accept')?.includes('application/json')) {
		event.respondWith(networkFirst(request, API_CACHE));
		return;
	}

	if (request.destination === 'audio' || request.destination === 'video') {
		event.respondWith(cacheFirst(request, MEDIA_CACHE));
		return;
	}

	if (request.destination === 'image' || request.destination === 'font') {
		event.respondWith(cacheFirst(request, RUNTIME_CACHE));
		return;
	}

	event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
});
