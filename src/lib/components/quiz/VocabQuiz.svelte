<script lang="ts">
	import { compliments, type Compliment } from '$lib/data/encouragement';
	import type {
		ColorVocab,
		NumberVocab,
		TimeVocabItem,
		LocationVocab,
		LocationWord,
		FamilyQuizItem,
		PeopleDescriptionItem,
		CalendarVocab
	} from '$lib/data/vocab';
	import { onDestroy, tick } from 'svelte';
	import LocationIcon from './LocationIcon.svelte';

	type VocabType = 'colors' | 'numbers' | 'time' | 'calendar' | 'locations' | 'family' | 'people';
	type VocabItem = { prompt: string; answer: string; hint?: string };
	type Mode = 'sprint' | 'race' | 'mastery';
	type Gender = 'feminine' | 'masculine';
	type Outcome = 'idle' | 'success' | 'fail' | 'time';

	let {
		type,
		colors = [],
		numbers = [],
		timeItems = [],
		timeMode = 'digital',
		calendarItems = [],
		locations = [],
		familyItems = [],
		peopleItems = []
	}: {
		type: VocabType;
		colors?: ColorVocab[];
		numbers?: NumberVocab[];
		timeItems?: TimeVocabItem[];
		timeMode?: 'analog' | 'digital';
		calendarItems?: CalendarVocab[];
		locations?: LocationVocab[];
		familyItems?: FamilyQuizItem[];
		peopleItems?: PeopleDescriptionItem[];
	} = $props();

	let isRunning = $state(false);
	let timeLeft = $state(60);
	let elapsed = $state(0);
	let correct = $state(0);
	let total = $state(0);
	let answer = $state('');
	let feedback = $state<'idle' | 'correct' | 'incorrect'>('idle');
	let current = $state<VocabItem | null>(null);
	let lastExpected = $state<string | null>(null);
	let mode = $state<Mode>('sprint');
	let target = $state(25);
	let outcome = $state<Outcome>('idle');
	let gender = $state<Gender>('feminine');
	let sessionEnded = $state(false);
	let endCompliment = $state<Compliment | null>(null);
	let answerInput: HTMLInputElement | null = null;

	let intervalId: number | null = null;

	const accuracy = $derived(total === 0 ? 0 : Math.round((correct / total) * 100));
	const raceTargets = [25, 50, 100];
	const placeholder = $derived(
		type === 'colors'
			? 'rosso'
			: type === 'numbers'
				? 'venticinque'
				: type === 'time'
					? 'sono le due e cinque'
					: type === 'calendar'
						? 'lunedì'
						: type === 'family'
							? 'mio padre'
							: type === 'people'
								? 'loro sono alti'
								: 'sopra'
	);
	const instruction = $derived(
		type === 'colors'
			? 'Type the Italian word for the color shown.'
			: type === 'numbers'
				? 'Type the Italian word for the number shown.'
				: type === 'time'
					? `Type the Italian time phrase (${timeMode === 'analog' ? 'analogue' : 'digital'}).`
					: type === 'calendar'
						? 'Type the Italian word for the calendar item shown.'
						: type === 'family'
							? 'Type the Italian possessive + family member.'
							: type === 'people'
								? 'Translate the sentence using pronoun + essere + adjective.'
								: 'Type the Italian preposition for the location shown.'
	);
	const title = $derived(
		type === 'colors'
			? 'Color Challenge'
			: type === 'numbers'
				? 'Number Challenge'
				: type === 'time'
					? 'Time Challenge'
					: type === 'calendar'
						? 'Calendar Challenge'
						: type === 'family'
							? 'Family Challenge'
							: type === 'people'
								? 'Describe People Challenge'
								: 'Location Challenge'
	);
	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainder = seconds % 60;
		return `${minutes}:${remainder.toString().padStart(2, '0')}`;
	};
	const timerValue = $derived(
		mode === 'sprint' ? `${timeLeft}s` : formatTime(elapsed)
	);
	const timerLabel = $derived(mode === 'sprint' ? 'Time left' : 'Time');
	const modeSummary = $derived(
		mode === 'sprint'
			? '60-second sprint.'
			: mode === 'race'
				? `Target ${target} correct.`
				: 'Mastery: 100 correct, zero mistakes.'
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
		if (type === 'calendar') {
			return calendarItems.map((item) => ({
				prompt: item.english,
				answer: item.italian,
				hint: item.category
			}));
		}
		if (type === 'time') {
			return timeItems.map((item) => ({
				prompt: item.prompt,
				answer: item.answer,
				hint: item.hint
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
		if (type === 'people') {
			return peopleItems.map((p) => ({
				prompt: p.english,
				answer: p.italian,
				hint: `${p.pronoun} → ${p.adjective}`
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

	const focusAnswer = async () => {
		await tick();
		answerInput?.focus();
	};

	const pickCompliment = () => {
		if (!compliments.length) return null;
		return compliments[Math.floor(Math.random() * compliments.length)];
	};

	const endSession = (nextOutcome?: Outcome) => {
		if (nextOutcome) {
			outcome = nextOutcome;
		}
		isRunning = false;
		clearTimer();
		sessionEnded = true;
		endCompliment = pickCompliment();
	};

	const start = () => {
		clearTimer();
		isRunning = true;
		timeLeft = 60;
		elapsed = 0;
		correct = 0;
		total = 0;
		feedback = 'idle';
		lastExpected = null;
		answer = '';
		outcome = 'idle';
		sessionEnded = false;
		endCompliment = null;
		pickPrompt();
		focusAnswer();

		intervalId = window.setInterval(() => {
			if (mode === 'sprint') {
				timeLeft = Math.max(0, timeLeft - 1);
				if (timeLeft === 0) {
					endSession('time');
				}
			} else {
				elapsed += 1;
			}
		}, 1000);
	};

	const stop = () => {
		endSession();
	};

	const skip = () => {
		if (!isRunning) return;
		pickPrompt();
		focusAnswer();
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

		let finished = false;
		if (mode === 'mastery' && !isCorrect) {
			outcome = 'fail';
			finished = true;
		}
		if (mode === 'race' && correct >= target) {
			outcome = 'success';
			finished = true;
		}
		if (mode === 'mastery' && isCorrect && correct >= 100) {
			outcome = 'success';
			finished = true;
		}

		if (finished) {
			endSession();
		}

		answer = '';
		if (isRunning) {
			pickPrompt();
			focusAnswer();
		}
	};

	onDestroy(clearTimer);
</script>

<section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<h3 class="text-xl font-semibold text-slate-900">{title}</h3>
			<p class="text-sm text-slate-500">{instruction}</p>
			<p class="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
				{modeSummary}
			</p>
		</div>
		<div class="flex items-center gap-3">
			<button
				onclick={isRunning ? stop : start}
				class={`rounded-full px-6 py-3 text-base font-semibold transition ${
					isRunning
						? 'bg-slate-900 text-white'
						: 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/30 hover:-translate-y-0.5'
				}`}
			>
				{isRunning ? 'Stop' : 'Start'}
			</button>
			<div class="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
				{timerLabel}
				<span class="ml-2 text-sm font-semibold text-slate-700">{timerValue}</span>
			</div>
		</div>
	</div>

	<div class="mt-4 flex flex-wrap items-center gap-3">
		<div class="flex flex-wrap gap-2">
			<button
				type="button"
				onclick={() => {
					mode = 'sprint';
					outcome = 'idle';
				}}
				disabled={isRunning}
				class={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
					mode === 'sprint'
						? 'border-slate-900 bg-slate-900 text-white'
						: 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
				}`}
			>
				Sprint
			</button>
			<button
				type="button"
				onclick={() => {
					mode = 'race';
					outcome = 'idle';
				}}
				disabled={isRunning}
				class={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
					mode === 'race'
						? 'border-slate-900 bg-slate-900 text-white'
						: 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
				}`}
			>
				Target
			</button>
			<button
				type="button"
				onclick={() => {
					mode = 'mastery';
					outcome = 'idle';
				}}
				disabled={isRunning}
				class={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
					mode === 'mastery'
						? 'border-slate-900 bg-slate-900 text-white'
						: 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
				}`}
			>
				Mastery
			</button>
		</div>

		{#if mode === 'race'}
			<div class="flex flex-wrap gap-2">
				{#each raceTargets as value (value)}
					<button
						type="button"
						onclick={() => {
							target = value;
							outcome = 'idle';
						}}
						disabled={isRunning}
						class={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
							target === value
								? 'border-amber-400 bg-amber-100 text-amber-800'
								: 'border-amber-100 bg-white text-amber-700 hover:border-amber-300'
						}`}
					>
						{value}
					</button>
				{/each}
			</div>
		{/if}
		{#if mode === 'mastery'}
			<p class="text-xs text-slate-500">Hit 100 correct with zero mistakes.</p>
		{/if}

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
					{:else if type === 'numbers'}
						<p class="text-sm text-slate-500">Write this number in Italian.</p>
					{:else if type === 'calendar'}
						<p class="text-sm text-slate-500">
							Translate the calendar word into Italian.
						</p>
					{:else if type === 'time'}
						<p class="text-sm text-slate-500">
							Write the time in Italian words.
						</p>
					{:else if type === 'family'}
						<p class="text-sm text-slate-500">
							Translate the family phrase into Italian.
						</p>
					{:else if type === 'locations'}
						<p class="text-sm text-slate-500">
							Translate the location phrase into Italian.
						</p>
						<div class="mt-3">
							<LocationIcon
								word={current.answer as LocationWord}
								className="text-slate-700"
								size={72}
							/>
						</div>
					{:else}
						<p class="text-sm text-slate-500">
							Translate the sentence into Italian using essere.
						</p>
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
					bind:this={answerInput}
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
						onclick={skip}
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

			{#if outcome !== 'idle'}
				<div
					class={`rounded-2xl border px-4 py-3 text-sm ${
						outcome === 'success'
							? 'border-emerald-200 bg-emerald-50 text-emerald-700'
							: outcome === 'fail'
								? 'border-rose-200 bg-rose-50 text-rose-700'
								: 'border-amber-200 bg-amber-50 text-amber-700'
					}`}
				>
					{#if outcome === 'success'}
						{#if mode === 'race'}
							Target hit in <span class="font-semibold">{formatTime(elapsed)}</span>.
						{:else if mode === 'mastery'}
							Mastery complete in <span class="font-semibold">{formatTime(elapsed)}</span>.
						{:else}
							Nice work!
						{/if}
					{:else if outcome === 'fail'}
						Mistake made — mastery failed. Try again!
					{:else}
						Time’s up! Check your score and restart.
					{/if}
				</div>
			{/if}

			{#if sessionEnded && endCompliment}
				<div class="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-4 text-sm text-indigo-800">
					<div class="flex flex-wrap items-center justify-between gap-3">
						<p class="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
							Encouragement
						</p>
						<div class="flex flex-wrap items-center gap-2">
							<p class="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-indigo-400">
								Gender
							</p>
							<div class="flex flex-wrap gap-2">
								<button
									type="button"
									aria-pressed={gender === 'feminine'}
									onclick={() => (gender = 'feminine')}
									class={`rounded-full border px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] transition ${
										gender === 'feminine'
											? 'border-indigo-300 bg-white text-indigo-800'
											: 'border-indigo-200 bg-indigo-100 text-indigo-700 hover:border-indigo-300'
									}`}
								>
									Feminine
								</button>
								<button
									type="button"
									aria-pressed={gender === 'masculine'}
									onclick={() => (gender = 'masculine')}
									class={`rounded-full border px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] transition ${
										gender === 'masculine'
											? 'border-indigo-300 bg-white text-indigo-800'
											: 'border-indigo-200 bg-indigo-100 text-indigo-700 hover:border-indigo-300'
									}`}
								>
									Masculine
								</button>
							</div>
						</div>
					</div>
					<p class="mt-2 text-lg font-semibold text-indigo-900">
						{gender === 'feminine'
							? endCompliment.it_feminine
							: endCompliment.it_masculine}
					</p>
					<p class="mt-1 text-sm text-indigo-700">
						{endCompliment.natural_english_version}
					</p>
					<p class="mt-2 text-xs text-indigo-500">
						Literal: {endCompliment.literal_translation_en}
					</p>
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
				<p class="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
					Mode: {mode}
				</p>
				{#if mode === 'race'}
					<p class="text-xs text-slate-500">Target: {target} correct</p>
				{:else if mode === 'mastery'}
					<p class="text-xs text-slate-500">Goal: 100 correct, no mistakes</p>
				{/if}
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
				{:else if type === 'calendar'}
					<p class="mt-2">
						Type the Italian word for each day, month, season, or time word shown.
					</p>
				{:else if type === 'time'}
					<p class="mt-2">
						Use "è l'una" for 1 o'clock, otherwise "sono le". Analogue uses 5-minute
						steps with e/meno (un quarto, mezza), digital uses all minutes.
					</p>
				{:else if type === 'family'}
					<p class="mt-2">
						Include the article when needed: plurals always need it (i miei fratelli), 
						singular family doesn't (mio padre) - except "loro" (il loro padre).
					</p>
				{:else if type === 'people'}
					<p class="mt-2">
						Use pronoun + essere + adjective. Match gender and number (o/a/i/e).
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
