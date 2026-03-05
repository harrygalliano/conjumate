<script lang="ts">
	import { learnTenses, type LearnTense } from '$lib/data/learn';

	type TenseId = LearnTense['id'];

	let activeTense = $state<TenseId>(learnTenses[0].id);
	const current = $derived(
		learnTenses.find((tense) => tense.id === activeTense) ?? learnTenses[0]
	);
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
				Choose a tense to get a quick, practical breakdown before you practice.
			</p>
		</header>

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
