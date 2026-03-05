<script lang="ts">
	import type { ColorVocab, NumberVocab, LocationVocab, FamilyQuizItem } from '$lib/data/vocab';
	import { onDestroy } from 'svelte';

	type VocabType = 'colors' | 'numbers' | 'locations' | 'family';
	type VocabItem = { prompt: string; answer: string; hint?: string };

	let {
		type,
		colors = [],
		numbers = [],
		locations = [],
		familyItems = []
	}: {
		type: VocabType;
		colors?: ColorVocab[];
		numbers?: NumberVocab[];
		locations?: LocationVocab[];
		familyItems?: FamilyQuizItem[];
	} = $props();

	let isRunning = $state(false);
	let timeLeft = $state(60);
	let correct = $state(0);
	let total = $state(0);
	let answer = $state('');
	let feedback = $state<'idle' | 'correct' | 'incorrect'>('idle');
	let current = $state<VocabItem | null>(null);
	let lastExpected = $state<string | null>(null);

	let intervalId: number | null = null;

	const accuracy = $derived(total === 0 ? 0 : Math.round((correct / total) * 100));
	const placeholder = $derived(
		type === 'colors'
			? 'rosso'
			: type === 'numbers'
				? 'venticinque'
				: type === 'family'
					? 'mio padre'
					: 'sopra'
	);
	const instruction = $derived(
		type === 'colors'
			? 'Type the Italian word for the color shown.'
			: type === 'numbers'
				? 'Type the Italian word for the number shown.'
				: type === 'family'
					? 'Type the Italian possessive + family member.'
					: 'Type the Italian preposition for the location shown.'
	);
	const title = $derived(
		type === 'colors'
			? 'Color Sprint'
			: type === 'numbers'
				? 'Number Sprint'
				: type === 'family'
					? 'Family Sprint'
					: 'Location Sprint'
	);

	const normalize = (input: string) =>
		input
			.trim()
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/['']/g, '')
			.replace(/\s+/g, ' ');

	const buildItems = (): VocabItem[] => {
		if (type === 'colors') {
			return colors.map((c) => ({
				prompt: c.english,
				answer: c.italian,
				hint: c.english
			}));
		}
		if (type === 'locations') {
			return locations.map((l) => ({
				prompt: l.english,
				answer: l.italian,
				hint: l.example
			}));
		}
		if (type === 'family') {
			return familyItems.map((f) => ({
				prompt: f.english,
				answer: f.italian,
				hint: `${f.pronoun} → ${f.member}`
			}));
		}
		return numbers.map((n) => ({
			prompt: String(n.value),
			answer: n.italian,
			hint: `Number ${n.value}`
		}));
	};

	const items = $derived(buildItems());

	const pickPrompt = () => {
		if (!items.length) {
			current = null;
			return;
		}
		current = items[Math.floor(Math.random() * items.length)];
	};

	const clearTimer = () => {
		if (intervalId !== null) {
			clearInterval(intervalId);
			intervalId = null;
		}
	};

	const start = () => {
		clearTimer();
		isRunning = true;
		timeLeft = 60;
		correct = 0;
		total = 0;
		feedback = 'idle';
		lastExpected = null;
		answer = '';
		pickPrompt();

		intervalId = window.setInterval(() => {
			timeLeft = Math.max(0, timeLeft - 1);
			if (timeLeft === 0) {
				isRunning = false;
				clearTimer();
			}
		}, 1000);
	};

	const stop = () => {
		isRunning = false;
		clearTimer();
	};

	const submit = () => {
		if (!isRunning || !current) return;

		const expected = normalize(current.answer);
		const isCorrect = normalize(answer) === expected;
		total += 1;

		if (isCorrect) {
			correct += 1;
			feedback = 'correct';
			lastExpected = null;
		} else {
			feedback = 'incorrect';
			lastExpected = current.answer;
		}

		answer = '';
		pickPrompt();
	};

	onDestroy(clearTimer);
</script>

<section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<h3 class="text-xl font-semibold text-slate-900">{title}</h3>
			<p class="text-sm text-slate-500">{instruction}</p>
		</div>
		<div class="flex items-center gap-3">
			<button
				onclick={isRunning ? stop : start}
				class="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
			>
				{isRunning ? 'Stop' : 'Start'}
			</button>
			<div class="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
				{timeLeft}s
			</div>
		</div>
	</div>

	<div class="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
		<div class="space-y-4">
			<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
				<p class="text-xs uppercase tracking-wide text-slate-400">Prompt</p>
				{#if current}
					<p class="mt-2 text-3xl font-bold text-slate-900">
						{current.prompt}
					</p>
					{#if type === 'colors'}
						<p class="text-sm text-slate-500">What is "{current.prompt}" in Italian?</p>
					{:else}
						<p class="text-sm text-slate-500">Write this number in Italian</p>
					{/if}
				{:else}
					<p class="mt-2 text-sm text-slate-500">No items loaded.</p>
				{/if}
			</div>

			<form
				class="space-y-3"
				onsubmit={(event) => {
					event.preventDefault();
					submit();
				}}
			>
				<input
					class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-sm focus:border-slate-400 focus:outline-none"
					type="text"
					bind:value={answer}
					placeholder={placeholder}
					disabled={!isRunning}
					autocapitalize="none"
					autocorrect="off"
					spellcheck="false"
				/>
				<div class="flex flex-wrap items-center gap-3">
					<button
						type="submit"
						class="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-900"
						disabled={!isRunning}
					>
						Submit
					</button>
					<button
						type="button"
						class="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
						onclick={pickPrompt}
						disabled={!isRunning}
					>
						Skip
					</button>
				</div>
			</form>

			{#if feedback !== 'idle'}
				<div
					class={`rounded-2xl px-4 py-3 text-sm ${{
						correct: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
						incorrect: 'bg-rose-50 text-rose-700 border border-rose-200'
					}[feedback]}`}
				>
					{#if feedback === 'correct'}
						Nice! Keep going.
					{:else}
						Correct answer: <span class="font-semibold">{lastExpected}</span>
					{/if}
				</div>
			{/if}
		</div>

		<div class="space-y-4">
			<div class="rounded-2xl border border-slate-200 bg-white p-4">
				<p class="text-xs uppercase tracking-wide text-slate-400">Score</p>
				<p class="mt-2 text-3xl font-semibold text-slate-900">
					{correct} / {total}
				</p>
				<p class="text-sm text-slate-500">Accuracy: {accuracy}%</p>
			</div>
			<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
				<p class="font-semibold text-slate-800">Quick tips</p>
				{#if type === 'colors'}
					<p class="mt-2">
						Type the Italian word for each color. Don't worry about accents - we'll
						accept the answer without them.
					</p>
				{:else if type === 'numbers'}
					<p class="mt-2">
						Type the Italian word for each number. For compound numbers like 21, write
						them as one word (ventuno).
					</p>
				{:else if type === 'family'}
					<p class="mt-2">
						Include the article when needed: plurals always need it (i miei fratelli), 
						singular family doesn't (mio padre) - except "loro" (il loro padre).
					</p>
				{:else}
					<p class="mt-2">
						Type the Italian preposition shown. Some words like tra/fra are
						interchangeable - we accept either.
					</p>
				{/if}
			</div>
		</div>
	</div>
</section>
