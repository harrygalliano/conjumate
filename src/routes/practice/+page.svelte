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
	import {
		colors,
		numbers,
		timeAnalogItems,
		timeDigitalItems,
		locations,
		calendar,
		familyMembers,
		familyQuizItems,
		possessives,
		peopleDescriptions
	} from '$lib/data/vocab';
	import { onMount } from 'svelte';

	type TabId = 'grammar' | 'vocab' | 'location';
	type VocabView =
		| 'list'
		| 'colors-test'
		| 'numbers-test'
		| 'time-analog-test'
		| 'time-digital-test'
		| 'calendar-test'
		| 'family-test'
		| 'people-test';
	type LocationView = 'list' | 'test';

	const tabItems: Array<{ id: TabId; label: string; description: string }> = [
		{ id: 'grammar', label: 'Grammar', description: 'Conjugation modes' },
		{
			id: 'vocab',
			label: 'Vocab',
			description: 'Colors + numbers + time + calendar + people + family'
		},
		{ id: 'location', label: 'Location', description: 'Prepositions' }
	];

	let activeTab = $state<TabId>('grammar');
	let vocabView = $state<VocabView>('list');
	let locationView = $state<LocationView>('list');
	let selectedTense = $state(TENSES[0].id);
	const currentTense = $derived(TENSES.find((tense) => tense.id === selectedTense) ?? TENSES[0]);
	const calendarSections = [
		{ id: 'basics', label: 'Basics', items: calendar.filter((item) => item.category === 'basics') },
		{ id: 'days', label: 'Days', items: calendar.filter((item) => item.category === 'days') },
		{ id: 'months', label: 'Months', items: calendar.filter((item) => item.category === 'months') },
		{ id: 'seasons', label: 'Seasons', items: calendar.filter((item) => item.category === 'seasons') }
	];

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
	<main class="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10">
		<header class="space-y-4">
			<div class="space-y-2">
				<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
					Conjumate Practice
				</p>
				<h1 class="text-3xl font-semibold text-white sm:text-4xl">Italian Trainer</h1>
				<p class="text-base text-slate-300 sm:text-lg">
					Pick a mode and start a fast drill.
				</p>
			</div>

			<div class="flex flex-wrap gap-2" role="tablist" aria-label="Practice tabs">
				{#each tabItems as tab (tab.id)}
					<button
						type="button"
						role="tab"
						aria-selected={activeTab === tab.id}
						onclick={() => setTab(tab.id)}
						class={`flex flex-1 flex-col gap-1 rounded-2xl border px-4 py-3 text-left transition sm:flex-none sm:min-w-[12rem] ${
							activeTab === tab.id
								? 'border-white/40 bg-white/10 text-white shadow-lg shadow-black/20'
								: 'border-white/10 bg-white/5 text-slate-200 hover:border-white/30'
						}`}
					>
						<span class="text-sm font-semibold uppercase tracking-[0.2em]">
							{tab.label}
						</span>
						<span class="text-xs text-slate-300">{tab.description}</span>
					</button>
				{/each}
			</div>
		</header>

		{#if activeTab === 'grammar'}
			<div id="grammar" class="space-y-10">
				<section class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
					<div class="space-y-4">
						<TenseSelect tenses={TENSES} bind:value={selectedTense} />
						<div class="rounded-3xl border border-white/10 bg-white/10 p-5 text-sm text-slate-200">
							<p class="font-semibold text-white">Quick rules</p>
						<p class="mt-2">
							Choose a tense, then pick Sprint, Target, or Mastery. Focus on speed and accuracy.
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
				{:else if vocabView === 'time-analog-test'}
					<div class="space-y-4">
						<div class="flex flex-wrap items-center justify-between gap-3">
							<button
								type="button"
								onclick={() => (vocabView = 'list')}
								class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
							>
								← Back to vocab list
							</button>
							<div class="flex flex-wrap gap-2">
								<button
									type="button"
									onclick={() => (vocabView = 'time-analog-test')}
									class="rounded-full border border-white/40 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 transition"
								>
									Analogue
								</button>
								<button
									type="button"
									onclick={() => (vocabView = 'time-digital-test')}
									class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white/40 hover:bg-white/20"
								>
									Digital
								</button>
							</div>
						</div>
						<VocabQuiz type="time" timeItems={timeAnalogItems} timeMode="analog" />
					</div>
				{:else if vocabView === 'time-digital-test'}
					<div class="space-y-4">
						<div class="flex flex-wrap items-center justify-between gap-3">
							<button
								type="button"
								onclick={() => (vocabView = 'list')}
								class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
							>
								← Back to vocab list
							</button>
							<div class="flex flex-wrap gap-2">
								<button
									type="button"
									onclick={() => (vocabView = 'time-analog-test')}
									class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white/40 hover:bg-white/20"
								>
									Analogue
								</button>
								<button
									type="button"
									onclick={() => (vocabView = 'time-digital-test')}
									class="rounded-full border border-white/40 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 transition"
								>
									Digital
								</button>
							</div>
						</div>
						<VocabQuiz type="time" timeItems={timeDigitalItems} timeMode="digital" />
					</div>
				{:else if vocabView === 'calendar-test'}
					<div class="space-y-4">
						<button
							type="button"
							onclick={() => (vocabView = 'list')}
							class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
						>
							← Back to vocab list
						</button>
						<VocabQuiz type="calendar" calendarItems={calendar} />
					</div>
				{:else if vocabView === 'people-test'}
					<div class="space-y-4">
						<button
							type="button"
							onclick={() => (vocabView = 'list')}
							class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
						>
							← Back to vocab list
						</button>
						<VocabQuiz type="people" peopleItems={peopleDescriptions} />
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
					<section class="grid gap-6 lg:grid-cols-3">
						<details class="group rounded-3xl border border-white/10 bg-white/10 p-6 shadow-sm">
							<summary class="flex cursor-pointer list-none items-center justify-between gap-3">
								<div>
									<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
										Colors
									</p>
									<h2 class="text-2xl font-semibold text-white">Colori essenziali</h2>
									<p class="mt-2 text-sm text-slate-200">
										30 common colors for everyday conversation.
									</p>
								</div>
								<div class="flex items-center gap-3">
									<span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
										30
									</span>
									<span class="text-sm text-white/70 transition-transform group-open:rotate-180">
										v
									</span>
								</div>
							</summary>
							<div class="mt-4">
								<button
									type="button"
									onclick={() => (vocabView = 'colors-test')}
									class="w-full rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
								>
									Test Me
								</button>
								<div class="mt-4 grid gap-3 sm:grid-cols-2">
									{#each colors as color (color.italian)}
										<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
											<p class="text-lg font-semibold text-white">{color.italian}</p>
											<p class="text-sm text-slate-300">{color.english}</p>
										</div>
									{/each}
								</div>
							</div>
						</details>

						<details class="group rounded-3xl border border-white/10 bg-white/10 p-6 shadow-sm">
							<summary class="flex cursor-pointer list-none items-center justify-between gap-3">
								<div>
									<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
										Numbers
									</p>
									<h2 class="text-2xl font-semibold text-white">0-100</h2>
									<p class="mt-2 text-sm text-slate-200">
										Scroll and drill the full range.
									</p>
								</div>
								<div class="flex items-center gap-3">
									<span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
										101
									</span>
									<span class="text-sm text-white/70 transition-transform group-open:rotate-180">
										v
									</span>
								</div>
							</summary>
							<div class="mt-4">
								<button
									type="button"
									onclick={() => (vocabView = 'numbers-test')}
									class="w-full rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
								>
									Test Me
								</button>
								<div class="mt-4 max-h-[28rem] overflow-auto pr-2">
									<div class="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
										{#each numbers as item (item.value)}
											<div class="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
												<p class="text-xs uppercase tracking-[0.15em] text-slate-300">
													{item.value}
												</p>
												<p class="text-sm font-semibold text-white">{item.italian}</p>
											</div>
										{/each}
									</div>
								</div>
							</div>
						</details>

						<details class="group rounded-3xl border border-white/10 bg-white/10 p-6 shadow-sm">
							<summary class="flex cursor-pointer list-none items-center justify-between gap-3">
								<div>
									<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
										Time
									</p>
									<h2 class="text-2xl font-semibold text-white">Che ora è?</h2>
									<p class="mt-2 text-sm text-slate-200">
										Practice telling the time in Italian.
									</p>
								</div>
								<div class="flex items-center gap-3">
									<span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
										{timeAnalogItems.length + timeDigitalItems.length}
									</span>
									<span class="text-sm text-white/70 transition-transform group-open:rotate-180">
										v
									</span>
								</div>
							</summary>
							<div class="mt-4">
								<div class="grid gap-3 sm:grid-cols-2">
									<button
										type="button"
										onclick={() => (vocabView = 'time-analog-test')}
										class="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
									>
										Analogue (5-min)
									</button>
									<button
										type="button"
										onclick={() => (vocabView = 'time-digital-test')}
										class="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/20"
									>
										Digital (all times)
									</button>
								</div>
								<div class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
									<p class="text-xs uppercase tracking-[0.2em] text-slate-300">
										Quick guide
									</p>
									<p class="mt-2 text-sm text-slate-200">
										Use "è l'una" for 1 o'clock, otherwise "sono le". Analogue uses
										e/meno with 5-minute steps.
									</p>
								</div>
							</div>
						</details>

						<details class="group rounded-3xl border border-white/10 bg-white/10 p-6 shadow-sm">
							<summary class="flex cursor-pointer list-none items-center justify-between gap-3">
								<div>
									<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
										Calendar
									</p>
									<h2 class="text-2xl font-semibold text-white">Tempo e date</h2>
									<p class="mt-2 text-sm text-slate-200">
										Days, months, seasons, and time basics.
									</p>
								</div>
								<div class="flex items-center gap-3">
									<span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
										{calendar.length}
									</span>
									<span class="text-sm text-white/70 transition-transform group-open:rotate-180">
										v
									</span>
								</div>
							</summary>
							<div class="mt-4">
								<button
									type="button"
									onclick={() => (vocabView = 'calendar-test')}
									class="w-full rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
								>
									Test Me
								</button>
								<div class="mt-4 grid gap-3 sm:grid-cols-2">
									{#each calendarSections as section (section.id)}
										<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
											<p class="text-xs uppercase tracking-[0.2em] text-slate-300">
												{section.label}
											</p>
											<div class="mt-2 grid gap-1">
												{#each section.items as item (item.italian)}
													<div class="flex items-center justify-between gap-3 text-sm">
														<span class="font-semibold text-white">{item.italian}</span>
														<span class="text-slate-300">{item.english}</span>
													</div>
												{/each}
											</div>
										</div>
									{/each}
								</div>
							</div>
						</details>

						<details class="group rounded-3xl border border-white/10 bg-white/10 p-6 shadow-sm">
							<summary class="flex cursor-pointer list-none items-center justify-between gap-3">
								<div>
									<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
										People
									</p>
									<h2 class="text-2xl font-semibold text-white">Descrivere le persone</h2>
									<p class="mt-2 text-sm text-slate-200">
										30 common descriptions using essere.
									</p>
								</div>
								<div class="flex items-center gap-3">
									<span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
										{peopleDescriptions.length}
									</span>
									<span class="text-sm text-white/70 transition-transform group-open:rotate-180">
										v
									</span>
								</div>
							</summary>
							<div class="mt-4">
								<button
									type="button"
									onclick={() => (vocabView = 'people-test')}
									class="w-full rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
								>
									Test Me
								</button>
								<div class="mt-4 grid gap-3 sm:grid-cols-2">
									{#each peopleDescriptions as item (item.italian)}
										<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
											<p class="text-base font-semibold text-white">{item.italian}</p>
											<p class="text-xs text-slate-300">{item.english}</p>
										</div>
									{/each}
								</div>
							</div>
						</details>
					</section>

					<details class="group rounded-3xl border border-white/10 bg-white/10 p-6 shadow-sm">
						<summary class="flex cursor-pointer list-none items-center justify-between gap-3">
							<div>
								<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
									Family
								</p>
								<h2 class="text-2xl font-semibold text-white">Famiglia</h2>
								<p class="mt-2 text-sm text-slate-200">
									Family members plus possessives.
								</p>
							</div>
							<div class="flex items-center gap-3">
								<span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
									{familyMembers.length}
								</span>
								<span class="text-sm text-white/70 transition-transform group-open:rotate-180">
									⌄
								</span>
							</div>
						</summary>
						<div class="mt-4">
							<button
								type="button"
								onclick={() => (vocabView = 'family-test')}
								class="w-full rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
							>
								Test Me
							</button>
							<div class="mt-4 grid gap-3 sm:grid-cols-2">
								{#each familyMembers as member (member.english)}
									<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
										<p class="text-lg font-semibold text-white">{member.italian}</p>
										<p class="text-sm text-slate-300">{member.english}</p>
									</div>
								{/each}
							</div>
							<div class="mt-4 border-t border-white/10 pt-4">
								<p class="text-xs uppercase tracking-[0.2em] text-slate-300">
									Possessives
								</p>
								<div class="mt-2 flex flex-wrap gap-2">
									{#each possessives as item (item.pronoun)}
										<span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
											{item.forms.ms} · {item.english}
										</span>
									{/each}
								</div>
							</div>
						</div>
					</details>
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
					<section class="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-sm">
						<div class="flex items-center justify-between gap-3">
							<div>
								<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
									Location
								</p>
								<h2 class="text-2xl font-semibold text-white">Dove si trova?</h2>
								<p class="mt-2 text-sm text-slate-200">
									Prepositions and common places.
								</p>
							</div>
							<span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
								{locations.length}
							</span>
						</div>
						<button
							type="button"
							onclick={() => (locationView = 'test')}
							class="mt-4 w-full rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
						>
							Test Me
						</button>
						<div class="mt-4 grid gap-3 sm:grid-cols-2">
							{#each locations as location (location.italian)}
								<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
									<div class="flex items-center gap-4">
										<LocationIcon word={location.italian} size={72} className="text-slate-200" />
										<div>
											<p class="text-lg font-semibold text-white">{location.italian}</p>
											<p class="text-sm text-slate-300">{location.english}</p>
											{#if location.example}
												<p class="mt-1 text-xs italic text-slate-400">
													{location.example}
												</p>
											{/if}
										</div>
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

<style>
	summary::-webkit-details-marker {
		display: none;
	}
	summary {
		list-style: none;
	}
</style>
