<script lang="ts">
	import type { TenseDefinition, Verb } from '$lib/data/italian';
	import { onDestroy } from 'svelte';

	type Subject = {
		id: 'io' | 'tu' | 'lui_lei' | 'noi' | 'voi' | 'loro';
		label: string;
		forms: string[];
	};

	type Prompt = { verb: Verb; subject: Subject };
	type Mode = 'sprint' | 'race' | 'mastery';

	let { verbs, tense }: { verbs: Verb[]; tense: TenseDefinition } = $props();

	const raceTargets = [25, 50, 100];

	const subjects: Subject[] = [
		{ id: 'io', label: 'io', forms: ['io'] },
		{ id: 'tu', label: 'tu', forms: ['tu'] },
		{ id: 'lui_lei', label: 'lui/lei', forms: ['lui', 'lei'] },
		{ id: 'noi', label: 'noi', forms: ['noi'] },
		{ id: 'voi', label: 'voi', forms: ['voi'] },
		{ id: 'loro', label: 'loro', forms: ['loro'] }
	];

	const auxiliaryForms: Record<Verb['auxiliary'], Record<Subject['id'], string>> = {
		avere: {
			io: 'ho',
			tu: 'hai',
			lui_lei: 'ha',
			noi: 'abbiamo',
			voi: 'avete',
			loro: 'hanno'
		},
		essere: {
			io: 'sono',
			tu: 'sei',
			lui_lei: 'è',
			noi: 'siamo',
			voi: 'siete',
			loro: 'sono'
		}
	};

	const stareForms: Record<Subject['id'], string> = {
		io: 'sto',
		tu: 'stai',
		lui_lei: 'sta',
		noi: 'stiamo',
		voi: 'state',
		loro: 'stanno'
	};

	const availableVerbs = $derived(
		tense.id === 'presente'
			? verbs.filter((verb) => verb.present)
			: tense.id === 'gerundio'
				? verbs.filter((verb) => verb.gerund)
				: verbs
	);

	let isRunning = $state(false);
	let timeLeft = $state(60);
	let elapsed = $state(0);
	let correct = $state(0);
	let total = $state(0);
	let answer = $state('');
	let feedback = $state<'idle' | 'correct' | 'incorrect'>('idle');
	let current = $state<Prompt | null>(null);
	let lastExpected = $state<string | null>(null);
	let mode = $state<Mode>('sprint');
	let target = $state(25);
	let outcome = $state<'idle' | 'success' | 'fail' | 'time'>('idle');

	let intervalId: number | null = null;

	const accuracy = $derived(total === 0 ? 0 : Math.round((correct / total) * 100));
	const placeholder = $derived(
		tense.id === 'presente'
			? 'io mangio'
			: tense.id === 'gerundio'
				? 'io sto mangiando'
				: 'io ho mangiato'
	);
	const instruction = $derived(
		tense.id === 'presente'
			? 'Type the full conjugation (pronoun + present form).'
			: tense.id === 'gerundio'
				? 'Type the full conjugation (pronoun + stare + gerundio).'
				: 'Type the full conjugation (pronoun + auxiliary + past participle).'
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
			.replace(/[’']/g, '')
			.replace(/\s+/g, ' ');

	const buildExpected = (prompt: Prompt) => {
		if (tense.id === 'presente') {
			const form = prompt.verb.present?.[prompt.subject.id];
			if (!form) return [];
			const withPronoun = prompt.subject.forms.map((value) => `${value} ${form}`);
			return [withPronoun[0], ...withPronoun.slice(1), form];
		}
		if (tense.id === 'gerundio') {
			const gerund = prompt.verb.gerund;
			if (!gerund) return [];
			const aux = stareForms[prompt.subject.id];
			const base = `${aux} ${gerund}`;
			const withPronoun = prompt.subject.forms.map((value) => `${value} ${base}`);
			return [withPronoun[0], ...withPronoun.slice(1), base];
		}

		const aux = auxiliaryForms[prompt.verb.auxiliary][prompt.subject.id];
		const base = `${aux} ${prompt.verb.pastParticiple}`;
		const withPronoun = prompt.subject.forms.map((form) => `${form} ${base}`);
		return [withPronoun[0], ...withPronoun.slice(1), base];
	};

	const pickPrompt = () => {
		if (!availableVerbs.length) {
			current = null;
			return;
		}

		const verb = availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
		const subject = subjects[Math.floor(Math.random() * subjects.length)];
		current = { verb, subject };
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
		elapsed = 0;
		correct = 0;
		total = 0;
		feedback = 'idle';
		lastExpected = null;
		answer = '';
		outcome = 'idle';
		pickPrompt();

		intervalId = window.setInterval(() => {
			if (mode === 'sprint') {
				timeLeft = Math.max(0, timeLeft - 1);
				if (timeLeft === 0) {
					isRunning = false;
					outcome = 'time';
					clearTimer();
				}
			} else {
				elapsed += 1;
			}
		}, 1000);
	};

	const stop = () => {
		isRunning = false;
		clearTimer();
	};

	const submit = () => {
		if (!isRunning || !current) return;

		const expectedRaw = buildExpected(current);
		if (!expectedRaw.length) {
			pickPrompt();
			return;
		}

		const expected = expectedRaw.map(normalize);
		const isCorrect = expected.includes(normalize(answer));
		total += 1;

		if (isCorrect) {
			correct += 1;
			feedback = 'correct';
			lastExpected = null;
		} else {
			feedback = 'incorrect';
			lastExpected = expectedRaw[0];
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
			isRunning = false;
			clearTimer();
		}

		answer = '';
		if (isRunning) {
			pickPrompt();
		}
	};

	onDestroy(clearTimer);
</script>

<section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<h3 class="text-xl font-semibold text-slate-900">Conjugation Challenge</h3>
			<p class="text-sm text-slate-500">{instruction}</p>
			<p class="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
				{modeSummary}
			</p>
		</div>
		<div class="flex items-center gap-3">
			<button
				onclick={isRunning ? stop : start}
				class="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
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
		{:else if mode === 'mastery'}
			<p class="text-xs text-slate-500">Hit 100 correct with zero mistakes.</p>
		{/if}
	</div>

	<div class="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
		<div class="space-y-4">
			<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
				<p class="text-xs uppercase tracking-wide text-slate-400">Prompt</p>
				{#if current}
					<p class="mt-2 text-lg font-semibold text-slate-900">
						{current.subject.label} + {current.verb.infinitive}
					</p>
					<p class="text-sm text-slate-500">
						{#if tense.id === 'presente'}
							Meaning: {current.verb.translation}
						{:else if tense.id === 'gerundio'}
							Pattern: stare + gerundio · Meaning: {current.verb.translation}
						{:else}
							Aux: {current.verb.auxiliary} · Meaning: {current.verb.translation}
						{/if}
					</p>
				{:else}
					<p class="mt-2 text-sm text-slate-500">No verbs loaded.</p>
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
				{#if tense.id === 'presente'}
					<p class="mt-2">
						Include the pronoun. We accept answers without it too. Focus on the present
						form.
					</p>
				{:else if tense.id === 'gerundio'}
					<p class="mt-2">
						Use stare + gerundio. We accept answers without the pronoun too.
					</p>
				{:else}
					<p class="mt-2">
						Include the pronoun. We accept answers without it too. For essere verbs, we
						simplify agreement in this drill.
					</p>
				{/if}
				<p class="mt-2">
					Tense selected: <span class="font-semibold">{tense.shortName}</span>
				</p>
			</div>
		</div>
	</div>
</section>
