<script lang="ts">
	import type { PrepositionGuide, PrepositionId } from '$lib/data/learn/prepositions';

	let { guide }: { guide: PrepositionGuide } = $props();

	let activeTab = $state<PrepositionId>('di');

	const current = $derived(guide.tabs.find((tab) => tab.id === activeTab) ?? guide.tabs[0]);

	const tabId = (id: string) => `preposition-tab-${id}`;
	const panelId = (id: string) => `preposition-panel-${id}`;
</script>

<svelte:head>
	<title>Conjumate · {guide.name}</title>
</svelte:head>

<div
	class="min-h-[100svh] bg-gradient-to-br from-slate-950 via-[#0b1020] to-[#140b2a] text-slate-100"
>
	<main class="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10">
		<div class="flex flex-wrap items-center gap-3 text-sm text-slate-400">
			<a
				href="/learn"
				class="rounded-full border border-slate-700 px-3 py-1 transition hover:border-slate-500 hover:text-white"
			>
				Back to learn
			</a>
			<span>/</span>
			<span>{guide.name}</span>
		</div>

		<header class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
			<p class="text-xs font-semibold tracking-[0.3em] text-amber-300 uppercase">
				Preposition Guide
			</p>
			<h1 class="mt-3 text-3xl font-semibold text-white sm:text-4xl">{guide.name}</h1>
			<p class="mt-3 max-w-3xl text-base text-slate-300 sm:text-lg">{guide.summary}</p>
			<div class="mt-6 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
				<div class="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
					<p class="text-xs tracking-[0.2em] text-slate-400 uppercase">Focus</p>
					<p class="mt-2 text-sm text-slate-200">{guide.focus}</p>
				</div>
				<div class="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4">
					<p class="text-xs tracking-[0.2em] text-amber-200 uppercase">Bridge To Articles</p>
					<p class="mt-2 text-sm text-amber-50">{guide.articulatedNote}</p>
				</div>
			</div>
		</header>

		<section class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
			<div class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
				<p class="text-xs font-semibold tracking-[0.3em] text-amber-300 uppercase">
					How To Use This
				</p>
				<div class="mt-4 space-y-3 text-sm text-slate-300">
					{#each guide.introduction as line, index (index)}
						<p>{line}</p>
					{/each}
				</div>
			</div>

			<div class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
				<p class="text-xs font-semibold tracking-[0.3em] text-amber-300 uppercase">Quick Pattern</p>
				<p class="mt-4 text-sm text-slate-300">
					Simple prepositions appear on their own, but several of them fuse with definite articles
					in everyday Italian.
				</p>
				<div class="mt-4 grid gap-2 sm:grid-cols-2">
					{#each guide.articulatedExamples as example (example)}
						<div
							class="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-white"
						>
							{example}
						</div>
					{/each}
				</div>
			</div>
		</section>

		<section class="space-y-4">
			<div class="flex flex-wrap gap-2" role="tablist" aria-label="Italian prepositions">
				{#each guide.tabs as tab (tab.id)}
					<button
						type="button"
						id={tabId(tab.id)}
						role="tab"
						aria-controls={panelId(tab.id)}
						aria-selected={activeTab === tab.id}
						onclick={() => (activeTab = tab.id)}
						class={`flex min-w-[9rem] flex-1 flex-col gap-1 rounded-2xl border px-4 py-3 text-left transition sm:flex-none ${
							activeTab === tab.id
								? 'border-amber-400/40 bg-amber-400/10 text-white'
								: 'border-slate-800 bg-slate-900/60 text-slate-200 hover:border-slate-600'
						}`}
					>
						<span class="text-lg font-semibold">{tab.label}</span>
						<span class="text-xs tracking-[0.2em] text-slate-400 uppercase">{tab.meaning}</span>
					</button>
				{/each}
			</div>

			{#if current}
				<div
					id={panelId(current.id)}
					role="tabpanel"
					aria-labelledby={tabId(current.id)}
					class="space-y-6"
				>
					<section class="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
						<div class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
							<p class="text-xs font-semibold tracking-[0.3em] text-amber-300 uppercase">Focus</p>
							<h2 class="mt-3 text-2xl font-semibold text-white">
								{current.label} = {current.meaning}
							</h2>
							<p class="mt-2 text-sm text-slate-300">{current.focus}</p>
							<div class="mt-4 space-y-3 text-sm text-slate-300">
								{#each current.description as line, index (index)}
									<p>{line}</p>
								{/each}
							</div>
						</div>

						<div class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
							<p class="text-xs font-semibold tracking-[0.3em] text-amber-300 uppercase">
								Common Uses
							</p>
							<div class="mt-4 space-y-3">
								{#each current.useCases as useCase (useCase.label)}
									<div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
										<p class="text-sm font-semibold text-white">{useCase.label}</p>
										<p class="mt-1 text-sm text-slate-300">{useCase.detail}</p>
										<div class="mt-3 flex flex-wrap gap-2">
											{#each useCase.examples as example (example)}
												<span
													class="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200"
												>
													{example}
												</span>
											{/each}
										</div>
									</div>
								{/each}
							</div>
						</div>
					</section>

					<section class="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
						<div class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
							<p class="text-xs font-semibold tracking-[0.3em] text-amber-300 uppercase">
								Examples
							</p>
							<ul class="mt-4 space-y-3">
								{#each current.examples as example (example.italian)}
									<li class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
										<p class="text-base font-semibold text-white">{example.italian}</p>
										<p class="text-sm text-slate-400">{example.english}</p>
									</li>
								{/each}
							</ul>
						</div>

						<div class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
							<p class="text-xs font-semibold tracking-[0.3em] text-amber-300 uppercase">Tips</p>
							<ul class="mt-4 space-y-2 text-sm text-slate-300">
								{#each current.tips as tip, index (index)}
									<li class="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">{tip}</li>
								{/each}
							</ul>
						</div>
					</section>
				</div>
			{/if}
		</section>
	</main>
</div>
