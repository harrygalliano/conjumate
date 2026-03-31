<script lang="ts">
	import { compliments, type Compliment } from '$lib/data/encouragement';
	import {
		isPrepositionArticleAnswerCorrect,
		prepositionArticleItems,
		prepositionArticleSources,
		type PrepositionArticleItem
	} from '$lib/data/prepositionPractice';
	import { onDestroy, tick } from 'svelte';

	type Mode = 'sprint' | 'race' | 'mastery';
	type Gender = 'feminine' | 'masculine';
	type Outcome = 'idle' | 'success' | 'fail' | 'time';

	const raceTargets = [25, 50, 100];
	const sourceGroups = prepositionArticleSources.filter((source) => source.forms);

	let isRunning = $state(false);
	let timeLeft = $state(60);
	let elapsed = $state(0);
	let correct = $state(0);
	let total = $state(0);
	let answer = $state('');
	let feedback = $state<'idle' | 'correct' | 'incorrect'>('idle');
	let current = $state<PrepositionArticleItem | null>(null);
	let lastExpected = $state<string | null>(null);
	let lastAlternate = $state<string | null>(null);
	let mode = $state<Mode>('sprint');
	let target = $state(25);
	let outcome = $state<Outcome>('idle');
	let gender = $state<Gender>('feminine');
	let sessionEnded = $state(false);
	let endCompliment = $state<Compliment | null>(null);
	let answerInput: HTMLInputElement | null = null;

	let intervalId: number | null = null;

	const accuracy = $derived(total === 0 ? 0 : Math.round((correct / total) * 100));
	const timerValue = $derived(mode === 'sprint' ? `${timeLeft}s` : formatTime(elapsed));
	const timerLabel = $derived(mode === 'sprint' ? 'Time left' : 'Time');
	const modeSummary = $derived(
		mode === 'sprint'
			? '60-second sprint.'
			: mode === 'race'
				? `Target ${target} correct.`
				: 'Mastery: 100 correct, zero mistakes.'
	);
	const placeholder = 'della';
	const meaningLabel = $derived(current ? current.meaning.join(', ') : '');
	const combineStatus = $derived(
		current?.combinesWithArticles === 'sometimes' ? 'Sometimes contracts' : 'Regular contraction'
	);

	function formatTime(seconds: number) {
		const minutes = Math.floor(seconds / 60);
		const remainder = seconds % 60;
		return `${minutes}:${remainder.toString().padStart(2, '0')}`;
	}

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

	const pickPrompt = () => {
		if (!prepositionArticleItems.length) {
			current = null;
			return;
		}

		current = prepositionArticleItems[Math.floor(Math.random() * prepositionArticleItems.length)];
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
		lastAlternate = null;
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

		const isCorrect = isPrepositionArticleAnswerCorrect(answer, current);
		total += 1;

		if (isCorrect) {
			correct += 1;
			feedback = 'correct';
			lastExpected = null;
			lastAlternate = null;
		} else {
			feedback = 'incorrect';
			lastExpected = current.answer;
			lastAlternate = current.alternateForm ?? null;
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
			<h3 class="text-xl font-semibold text-slate-900">Preposition Combo Challenge</h3>
			<p class="text-sm text-slate-500">
				Type the articulated form for the preposition + article pair shown.
			</p>
			<p class="mt-1 text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
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
			<div
				class="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold tracking-[0.15em] text-slate-500 uppercase"
			>
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
				class={`rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.2em] uppercase transition ${
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
				class={`rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.2em] uppercase transition ${
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
				class={`rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.2em] uppercase transition ${
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
						class={`rounded-full border px-3 py-2 text-xs font-semibold tracking-[0.2em] uppercase transition ${
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
				<p class="text-xs tracking-wide text-slate-400 uppercase">Prompt</p>
				{#if current}
					<div class="mt-3 flex flex-wrap items-center gap-3">
						<p class="text-3xl font-bold text-slate-900">
							{current.preposition} + {current.article}
						</p>
						<span
							class={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.2em] uppercase ${
								current.combinesWithArticles === 'sometimes'
									? 'border-sky-200 bg-sky-100 text-sky-700'
									: 'border-emerald-200 bg-emerald-100 text-emerald-700'
							}`}
						>
							{combineStatus}
						</span>
					</div>
					<p class="mt-2 text-sm text-slate-500">Meaning: {meaningLabel}</p>
					{#if current.notes}
						<p class="mt-2 text-sm text-slate-500">{current.notes}</p>
					{/if}
					{#if current.alternateForm}
						<p class="mt-2 text-xs font-semibold tracking-[0.15em] text-slate-400 uppercase">
							Also used: {current.alternateForm}
						</p>
					{/if}
				{:else}
					<p class="mt-2 text-sm text-slate-500">No preposition forms loaded.</p>
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
					{placeholder}
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
					class={`rounded-2xl px-4 py-3 text-sm ${
						{
							correct: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
							incorrect: 'border border-rose-200 bg-rose-50 text-rose-700'
						}[feedback]
					}`}
				>
					{#if feedback === 'correct'}
						Nice! Keep going.
					{:else}
						Correct answer: <span class="font-semibold">{lastExpected}</span>
						{#if lastAlternate}
							<span class="text-rose-600">. Also accepted: {lastAlternate}</span>
						{/if}
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
						Mistake made - mastery failed. Try again!
					{:else}
						Time's up! Check your score and restart.
					{/if}
				</div>
			{/if}

			{#if sessionEnded && endCompliment}
				<div
					class="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-4 text-sm text-indigo-800"
				>
					<div class="flex flex-wrap items-center justify-between gap-3">
						<p class="text-xs font-semibold tracking-[0.2em] text-indigo-400 uppercase">
							Encouragement
						</p>
						<div class="flex flex-wrap items-center gap-2">
							<p class="text-[0.65rem] font-semibold tracking-[0.2em] text-indigo-400 uppercase">
								Gender
							</p>
							<div class="flex flex-wrap gap-2">
								<button
									type="button"
									aria-pressed={gender === 'feminine'}
									onclick={() => (gender = 'feminine')}
									class={`rounded-full border px-3 py-2 text-[0.65rem] font-semibold tracking-[0.2em] uppercase transition ${
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
									class={`rounded-full border px-3 py-2 text-[0.65rem] font-semibold tracking-[0.2em] uppercase transition ${
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
						{gender === 'feminine' ? endCompliment.it_feminine : endCompliment.it_masculine}
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
			<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
				<p class="text-xs tracking-wide text-slate-400 uppercase">Score</p>
				<div class="mt-3 grid grid-cols-3 gap-3 text-center">
					<div class="rounded-2xl bg-white px-3 py-4 shadow-sm">
						<p class="text-2xl font-semibold text-slate-900">{correct}</p>
						<p class="text-xs tracking-[0.2em] text-slate-400 uppercase">Correct</p>
					</div>
					<div class="rounded-2xl bg-white px-3 py-4 shadow-sm">
						<p class="text-2xl font-semibold text-slate-900">{total}</p>
						<p class="text-xs tracking-[0.2em] text-slate-400 uppercase">Attempts</p>
					</div>
					<div class="rounded-2xl bg-white px-3 py-4 shadow-sm">
						<p class="text-2xl font-semibold text-slate-900">{accuracy}%</p>
						<p class="text-xs tracking-[0.2em] text-slate-400 uppercase">Accuracy</p>
					</div>
				</div>
			</div>

			<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
				<div class="flex items-center justify-between gap-3">
					<div>
						<p class="text-xs tracking-wide text-slate-400 uppercase">Reference</p>
						<p class="mt-1 text-sm text-slate-500">
							Systematic contractions plus the common contracted `con` forms.
						</p>
					</div>
					<a
						href="/learn/prepositions"
						class="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-slate-600 uppercase transition hover:border-slate-400 hover:text-slate-900"
					>
						Open Lesson
					</a>
				</div>
				<div class="mt-4 space-y-3">
					{#each sourceGroups as group (group.preposition)}
						<div class="rounded-2xl border border-slate-200 bg-white p-4">
							<div class="flex flex-wrap items-center gap-2">
								<p class="text-base font-semibold text-slate-900">{group.preposition}</p>
								<span
									class={`rounded-full px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.2em] uppercase ${
										group.combines_with_articles === 'sometimes'
											? 'bg-sky-100 text-sky-700'
											: 'bg-emerald-100 text-emerald-700'
									}`}
								>
									{group.combines_with_articles === 'sometimes' ? 'Sometimes' : 'Regular'}
								</span>
								<span class="text-sm text-slate-500">{group.meaning.join(', ')}</span>
							</div>
							<div class="mt-3 flex flex-wrap gap-2">
								{#each Object.entries(group.forms ?? {}) as [article, combined] (article)}
									<span
										class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
									>
										{group.preposition} + {article} = {combined}
									</span>
								{/each}
							</div>
							{#if group.notes}
								<p class="mt-3 text-sm text-slate-500">{group.notes}</p>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
