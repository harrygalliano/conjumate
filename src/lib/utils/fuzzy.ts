/**
 * Simple fuzzy search implementation
 * Returns a score (higher = better match)
 */
export function fuzzyMatch(query: string, target: string): number {
	const q = query.toLowerCase().trim();
	const t = target.toLowerCase();

	if (!q) return 0;
	if (t === q) return 100; // Exact match
	if (t.startsWith(q)) return 90; // Starts with
	if (t.includes(q)) return 70; // Contains

	// Character-by-character fuzzy
	let qIndex = 0;
	let score = 0;
	let consecutive = 0;

	for (let i = 0; i < t.length && qIndex < q.length; i++) {
		if (t[i] === q[qIndex]) {
			score += 10 + consecutive * 5;
			consecutive++;
			qIndex++;
		} else {
			consecutive = 0;
		}
	}

	// Only return score if we matched all query characters
	if (qIndex !== q.length) return 0;

	// Bonus for shorter targets (more relevant)
	score += Math.max(0, 20 - (t.length - q.length));

	return score;
}

export type SearchResult<T> = {
	item: T;
	score: number;
};

/**
 * Search items using fuzzy matching
 */
export function fuzzySearch<T>(
	items: T[],
	query: string,
	getSearchFields: (item: T) => string[],
	maxResults = 10
): SearchResult<T>[] {
	if (!query.trim()) return [];

	const results: SearchResult<T>[] = [];

	for (const item of items) {
		const fields = getSearchFields(item);
		let bestScore = 0;

		for (const field of fields) {
			const score = fuzzyMatch(query, field);
			if (score > bestScore) bestScore = score;
		}

		if (bestScore > 0) {
			results.push({ item, score: bestScore });
		}
	}

	return results.sort((a, b) => b.score - a.score).slice(0, maxResults);
}
