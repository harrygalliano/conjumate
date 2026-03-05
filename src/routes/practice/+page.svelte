<script lang="ts">
	import {
		ConjugationQuiz,
		LocationIcon,
		TenseBlurb,
		TenseSelect,
		VerbList,
		VocabQuiz
	} from '$lib/components/quiz';
	import { TENSES, italianVerbs } from '$lib/data/italian';
	import { colors, numbers, locations, familyMembers, familyQuizItems, possessives } from '$lib/data/vocab';
	import { onMount } from 'svelte';

	type TabId = 'grammar' | 'vocab' | 'location';
	type VocabView = 'list' | 'colors-test' | 'numbers-test' | 'family-test';
	type LocationView = 'list' | 'test';

	const tabItems: Array<{ id: TabId; label: string; description: string }> = [
		{ id: 'grammar', label: 'Grammar', description: 'Conjugation sprints' },
		{ id: 'vocab', label: 'Vocab', description: 'Colors + numbers + family' },
		{ id: 'location', label: 'Location', description: 'Prepositions' }
	];

	let activeTab = $state<TabId>('grammar');
	let vocabView = $state<VocabView>('list');
	let locationView = $state<LocationView>('list');
	let selectedTense = $state(TENSES[0].id);
	const currentTense = $derived(TENSES.find((tense) => tense.id === selectedTense) ?? TENSES[0]);

	const setTab = (tabId: TabId) => {
		activeTab = tabId;
		vocabView = 'list';
		locationView = 'list';
		if (typeof window !== 'undefined') {
			window.history.replaceState(null, '', `#${tabId}`);
		}
	};

	const syncFromHash = () => {
		if (typeof window === 'undefined') return;
		const hash = window.location.hash.replace('#', '');
		if (hash === 'grammar' || hash === 'vocab' || hash === 'location') {
			activeTab = hash as TabId;
		}
	};

	onMount(() => {
		syncFromHash();
		const handler = () => syncFromHash();
		window.addEventListener('hashchange', handler);
		return () => window.removeEventListener('hashchange', handler);
	});
</script>

<svelte:head>
	<title>Conjumate · Practice</title>
</svelte:head>

<div class="min-h-[100svh] bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
	<div class="mx-auto w-full max-w-6xl px-4 py-10">
		<div class="grid gap-8 lg:grid-cols-[220px_1fr]">
			<aside class="flex flex-col gap-4 lg:sticky lg:top-8">
				<nav
					class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
					aria-label="Practice navigation"
				>
					<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
						Navigate
					</p>
					<div class="mt-4 flex flex-wrap gap-2 lg:flex-col">
						<a
							href="/"
							class="flex min-w-[6.5rem] items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 lg:w-full"
						>
							<span>Home</span>
							<span class="text-xs uppercase tracking-[0.2em] text-slate-400">/</span>
						</a>
						{#each tabItems as tab (tab.id)}
							<button
								type="button"
								onclick={() => setTab(tab.id)}
								aria-current={activeTab === tab.id ? 'page' : undefined}
								class={`flex min-w-[6.5rem] flex-1 flex-col gap-1 rounded-2xl border px-4 py-3 text-left transition lg:w-full ${
									activeTab === tab.id
										? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-black/10'
										: 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
								}`}
							>
								<span class="text-sm font-semibold uppercase tracking-[0.2em]">
									{tab.label}
								</span>
								<span
									class={`text-xs ${
										activeTab === tab.id ? 'text-slate-300' : 'text-slate-400'
									}`}
								>
									{tab.description}
								</span>
							</button>
						{/each}
					</div>
				</nav>
				<div class="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
					<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
						Mode
					</p>
					<p class="mt-2 text-lg font-semibold text-slate-900">
						{activeTab === 'grammar'
							? 'Grammar Sprint'
							: activeTab === 'vocab'
								? 'Vocabulary Builder'
								: 'Location Prepositions'}
					</p>
					<p class="mt-2">
						{activeTab === 'grammar'
							? 'Pick a tense and race the clock.'
							: activeTab === 'vocab'
								? 'Memorize colors and numbers fast.'
								: 'Learn where things are in Italian.'}
					</p>
				</div>
			</aside>

			<main class="flex flex-col gap-10">
				<header class="space-y-2">
					<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
						Conjumate Practice
					</p>
					<h1 class="text-3xl font-semibold text-white sm:text-4xl">
						Italian Trainer
					</h1>
					<p class="text-base text-slate-300 sm:text-lg">
						Switch between grammar sprints and vocab drills whenever you want.
					</p>
				</header>

				{#if activeTab === 'grammar'}
					<div id="grammar" class="space-y-10">
						<section class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
							<div class="space-y-4">
								<TenseSelect tenses={TENSES} bind:value={selectedTense} />
								<div class="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
									<p class="font-semibold text-slate-800">How it works</p>
									<p class="mt-2">
										We keep it simple: type the conjugation and keep your streak alive for 60
										seconds.
									</p>
								</div>
							</div>
							<TenseBlurb tense={currentTense} />
						</section>

						<ConjugationQuiz verbs={italianVerbs} tense={currentTense} />

						<VerbList verbs={italianVerbs} label={currentTense.shortName} />
					</div>
				{:else if activeTab === 'vocab'}
					<div id="vocab" class="space-y-10">
						{#if vocabView === 'colors-test'}
							<div class="space-y-4">
								<button
									type="button"
									onclick={() => (vocabView = 'list')}
									class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
								>
									← Back to vocab list
								</button>
								<VocabQuiz type="colors" {colors} />
							</div>
						{:else if vocabView === 'numbers-test'}
							<div class="space-y-4">
								<button
									type="button"
									onclick={() => (vocabView = 'list')}
									class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
								>
									← Back to vocab list
								</button>
								<VocabQuiz type="numbers" {numbers} />
							</div>
						{:else if vocabView === 'family-test'}
							<div class="space-y-4">
								<button
									type="button"
									onclick={() => (vocabView = 'list')}
									class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
								>
									← Back to vocab list
								</button>
								<VocabQuiz type="family" familyItems={familyQuizItems} />
							</div>
						{:else}
							<section class="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
								<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
									<div class="flex items-center justify-between gap-3">
										<div>
											<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
												Colors
											</p>
											<h2 class="text-2xl font-semibold text-slate-900">Colori essenziali</h2>
											<p class="mt-2 text-sm text-slate-500">
												30 common colors for everyday conversation.
											</p>
										</div>
										<span class="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
											30
										</span>
									</div>
									<button
										type="button"
										onclick={() => (vocabView = 'colors-test')}
										class="mt-4 w-full rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
									>
										Test Me
									</button>
									<div class="mt-4 grid gap-3 sm:grid-cols-2">
										{#each colors as color (color.italian)}
											<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
												<p class="text-lg font-semibold text-slate-900">{color.italian}</p>
												<p class="text-sm text-slate-500">{color.english}</p>
											</div>
										{/each}
									</div>
								</div>

								<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
									<div class="flex items-center justify-between gap-3">
										<div>
											<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
												Numbers
											</p>
											<h2 class="text-2xl font-semibold text-slate-900">0-100</h2>
											<p class="mt-2 text-sm text-slate-500">
												Scroll and drill the full range.
											</p>
										</div>
										<span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
											101
										</span>
									</div>
									<button
										type="button"
										onclick={() => (vocabView = 'numbers-test')}
										class="mt-4 w-full rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
									>
										Test Me
									</button>
									<div class="mt-4 max-h-[32rem] overflow-auto pr-2">
										<div class="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
											{#each numbers as item (item.value)}
												<div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
													<p class="text-xs uppercase tracking-[0.15em] text-slate-400">
														{item.value}
													</p>
													<p class="hyphens-auto break-words text-sm font-semibold text-slate-900">
														{item.italian}
													</p>
												</div>
											{/each}
										</div>
									</div>
								</div>
							</section>

							<section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
								<div class="flex items-center justify-between gap-3">
									<div>
										<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
											Family
										</p>
										<h2 class="text-2xl font-semibold text-slate-900">La Famiglia</h2>
										<p class="mt-2 text-sm text-slate-500">
											Family members with possessive adjectives. Learn to say "my father", "our aunts", etc.
										</p>
									</div>
									<span class="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
										{familyMembers.length}
									</span>
								</div>
								<button
									type="button"
									onclick={() => (vocabView = 'family-test')}
									class="mt-4 w-full rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
								>
									Test Me
								</button>
								<div class="mt-4 space-y-4">
									<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
										<p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Possessives</p>
										<div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
											{#each possessives as poss (poss.pronoun)}
												<div class="text-sm">
													<span class="font-semibold text-slate-900">{poss.english}</span>
													<span class="text-slate-500"> → {poss.forms.ms}/{poss.forms.fs}</span>
												</div>
											{/each}
										</div>
									</div>
									<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
										{#each familyMembers as member (member.english)}
											<div class="rounded-2xl border border-slate-200 bg-slate-50 p-3">
												<p class="font-semibold text-slate-900">{member.italian}</p>
												<p class="text-xs text-slate-500">{member.english}</p>
												<p class="mt-1 text-xs text-slate-400">pl: {member.plural}</p>
											</div>
										{/each}
									</div>
								</div>
							</section>
						{/if}
					</div>
				{:else}
					<div id="location" class="space-y-10">
						{#if locationView === 'test'}
							<div class="space-y-4">
								<button
									type="button"
									onclick={() => (locationView = 'list')}
									class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
								>
									← Back to location list
								</button>
								<VocabQuiz type="locations" {locations} />
							</div>
						{:else}
							<section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
								<div class="flex items-center justify-between gap-3">
									<div>
										<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
											Prepositions
										</p>
										<h2 class="text-2xl font-semibold text-slate-900">Location Words</h2>
										<p class="mt-2 text-sm text-slate-500">
											20 essential prepositions for describing where things are.
										</p>
									</div>
									<span class="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
										20
									</span>
								</div>
								<button
									type="button"
									onclick={() => (locationView = 'test')}
									class="mt-4 w-full rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
								>
									Test Me
								</button>
								<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
									{#each locations as loc (loc.italian)}
										<div class="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
											<div class="shrink-0">
												<LocationIcon word={loc.italian} />
											</div>
											<div class="min-w-0 flex-1">
												<p class="text-lg font-semibold text-slate-900">{loc.italian}</p>
												<p class="text-sm text-slate-500">{loc.english}</p>
												{#if loc.example}
													<p class="mt-1 text-xs italic text-slate-400">{loc.example}</p>
												{/if}
											</div>
										</div>
									{/each}
								</div>
							</section>
						{/if}
					</div>
				{/if}
			</main>
		</div>
	</div>
</div>
