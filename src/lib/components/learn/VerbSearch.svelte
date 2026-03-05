<script lang="ts">
	import { fuzzySearch } from '$lib/utils/fuzzy';
	import type { Verb } from '$lib/data/italian';

	let {
		verbs,
		onselect
	}: {
		verbs: Verb[];
		onselect: (verb: Verb) => void;
	} = $props();

	let query = $state('');
	let isOpen = $state(false);
	let selectedIndex = $state(0);

	const results = $derived(
		fuzzySearch(verbs, query, (v) => [v.infinitive, v.translation], 8)
	);

	const handleKeydown = (e: KeyboardEvent) => {
		if (!isOpen || results.length === 0) return;

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, 0);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			selectVerb(results[selectedIndex].item);
		} else if (e.key === 'Escape') {
			isOpen = false;
		}
	};

	const selectVerb = (verb: Verb) => {
		query = verb.infinitive;
		isOpen = false;
		onselect(verb);
	};

	const handleFocus = () => {
		isOpen = true;
		selectedIndex = 0;
	};

	const handleBlur = () => {
		// Delay to allow click on dropdown items
		setTimeout(() => (isOpen = false), 150);
	};

	$effect(() => {
		if (query) {
			isOpen = true;
			selectedIndex = 0;
		}
	});
</script>

<div class="relative">
	<div class="relative">
		<input
			type="text"
			bind:value={query}
			onkeydown={handleKeydown}
			onfocus={handleFocus}
			onblur={handleBlur}
			placeholder="Search verbs (e.g., essere, to be)..."
			class="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 pl-10 text-base text-white placeholder-slate-500 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20"
		/>
		<svg
			class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			/>
		</svg>
	</div>

	{#if isOpen && results.length > 0}
		<ul
			class="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/95 shadow-xl backdrop-blur"
			role="listbox"
		>
			{#each results as { item: verb }, i (verb.infinitive)}
				<li>
					<button
						type="button"
						role="option"
						aria-selected={i === selectedIndex}
						onclick={() => selectVerb(verb)}
						class={`flex w-full items-center justify-between px-4 py-3 text-left transition ${
							i === selectedIndex
								? 'bg-amber-400/20 text-white'
								: 'text-slate-200 hover:bg-slate-800'
						}`}
					>
						<span class="font-semibold">{verb.infinitive}</span>
						<span class="text-sm text-slate-400">{verb.translation}</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	{#if isOpen && query && results.length === 0}
		<div
			class="absolute z-50 mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/95 px-4 py-3 text-sm text-slate-400"
		>
			No verbs found for "{query}"
		</div>
	{/if}
</div>
