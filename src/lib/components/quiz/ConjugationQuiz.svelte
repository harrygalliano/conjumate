<script lang="ts">
	import type { TenseDefinition, Verb } from '$lib/data/italian';
	import { onDestroy } from 'svelte';

	type Subject = {
		id: 'io' | 'tu' | 'lui_lei' | 'noi' | 'voi' | 'loro';
		label: string;
		forms: string[];
	};

	type Prompt = { verb: Verb; subject: Subject };

	let { verbs, tense }: { verbs: Verb[]; tense: TenseDefinition } = $props();

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
	let correct = $state(0);
	let total = $state(0);
	let answer = $state('');
	let feedback = $state<'idle' | 'correct' | 'incorrect'>('idle');
	let current = $state<Prompt | null>(null);
	let lastExpected = $state<string | null>(null);

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

		answer = '';
		pickPrompt();
	};

	onDestroy(clearTimer);
</script>

<section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<h3 class="text-xl font-semibold text-slate-900">One-Minute Conjugation Sprint</h3>
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
