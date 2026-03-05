<script lang="ts">
	import { learnTenses, type LearnTense } from '$lib/data/learn';
	import { italianVerbs, type Verb } from '$lib/data/italian';
	import { VerbSearch, ConjugationBreakdown } from '$lib/components/learn';

	type TenseId = LearnTense['id'];
	type ViewMode = 'overview' | 'verb-lookup';

	let viewMode = $state<ViewMode>('overview');
	let activeTense = $state<TenseId>(learnTenses[0].id);
	let selectedVerb = $state<Verb | null>(null);

	const current = $derived(
		learnTenses.find((tense) => tense.id === activeTense) ?? learnTenses[0]
	);

	const handleVerbSelect = (verb: Verb) => {
		selectedVerb = verb;
	};

	const clearVerb = () => {
		selectedVerb = null;
	};
</script>

<svelte:head>
	<title>Conjumate · Learn</title>
</svelte:head>

<div class="min-h-[100svh] bg-gradient-to-br from-slate-950 via-[#0b1020] to-[#140b2a] text-slate-100">
	<main class="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10">
		<header class="space-y-3">
			<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Learn</p>
			<h1 class="text-3xl font-semibold text-white sm:text-4xl">Grammar Library</h1>
			<p class="text-base text-slate-300 sm:text-lg">
				Search for any verb and see how to conjugate it, or explore tense guides below.
			</p>
		</header>

		<!-- Verb Lookup Section -->
		<section class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
			<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Verb Lookup</p>
			<p class="mt-2 text-sm text-slate-400">
				Search 100 common Italian verbs by Italian or English
			</p>
			<div class="mt-4">
				<VerbSearch verbs={italianVerbs} onselect={handleVerbSelect} />
			</div>

			{#if selectedVerb}
				<div class="mt-6 space-y-4">
					<div class="flex items-center justify-between">
						<p class="text-sm text-slate-400">
							Selected: <span class="font-semibold text-white">{selectedVerb.infinitive}</span>
						</p>
						<button
							type="button"
							onclick={clearVerb}
							class="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-400 transition hover:border-slate-500 hover:text-white"
						>
							Clear
						</button>
					</div>

					<!-- Tense selector for verb lookup -->
					<div class="flex flex-wrap gap-2">
						{#each learnTenses as tense (tense.id)}
							<button
								type="button"
								onclick={() => (activeTense = tense.id)}
								class={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
									activeTense === tense.id
										? 'border-amber-400/40 bg-amber-400/20 text-amber-300'
										: 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
								}`}
							>
								{tense.shortName}
							</button>
						{/each}
					</div>

					<ConjugationBreakdown verb={selectedVerb} tense={current} />
				</div>
			{/if}
		</section>

		<!-- Tense Guide Section -->
		<div class="border-t border-slate-800 pt-10">
			<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Tense Guides</p>
			<p class="mt-2 text-sm text-slate-400">
				Learn the rules and patterns for each tense
			</p>
		</div>

		<div class="flex flex-wrap gap-2" role="tablist" aria-label="Learn tabs">
			{#each learnTenses as tense (tense.id)}
				<button
					type="button"
					role="tab"
					aria-selected={activeTense === tense.id}
					onclick={() => (activeTense = tense.id)}
					class={`flex flex-1 flex-col gap-1 rounded-2xl border px-4 py-3 text-left transition sm:flex-none sm:min-w-[12rem] ${
						activeTense === tense.id
							? 'border-amber-400/40 bg-amber-400/10 text-white'
							: 'border-slate-800 bg-slate-900/60 text-slate-200 hover:border-slate-600'
					}`}
				>
					<span class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
						{tense.shortName}
					</span>
					<span class="text-sm font-semibold">{tense.name}</span>
				</button>
			{/each}
		</div>

		<section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
			<div class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
				<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Focus</p>
				<h2 class="mt-3 text-2xl font-semibold text-white">{current.name}</h2>
				<p class="mt-2 text-sm text-slate-300">{current.focus}</p>
				<div class="mt-4 space-y-2 text-sm text-slate-300">
					{#each current.description as line, index (index)}
						<p>{line}</p>
					{/each}
				</div>
				<div class="mt-4 rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
					<p class="text-xs uppercase tracking-[0.2em] text-slate-400">Formula</p>
					<p class="mt-2 text-base font-semibold text-white">{current.formula}</p>
				</div>
			</div>

			<div class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
				<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Examples</p>
				<ul class="mt-4 space-y-3">
					{#each current.examples as example (example.italian)}
						<li class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
							<p class="text-base font-semibold text-white">{example.italian}</p>
							<p class="text-sm text-slate-400">{example.english}</p>
						</li>
					{/each}
				</ul>
			</div>
		</section>

		<section class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
			<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Tips</p>
			<ul class="mt-4 space-y-2 text-sm text-slate-300">
				{#each current.tips as tip, index (index)}
					<li class="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">{tip}</li>
				{/each}
			</ul>
		</section>
	</main>
</div>
