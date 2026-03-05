<script lang="ts">
	import type { Verb } from '$lib/data/italian';
	import type { LearnTense } from '$lib/data/learn';

	let {
		verb,
		tense
	}: {
		verb: Verb;
		tense: LearnTense;
	} = $props();

	const pronouns = ['io', 'tu', 'lui/lei', 'noi', 'voi', 'loro'] as const;
	const pronounKeys = ['io', 'tu', 'lui_lei', 'noi', 'voi', 'loro'] as const;

	// Get verb ending type
	const getVerbType = (infinitive: string): '-are' | '-ere' | '-ire' | 'irregular' => {
		if (infinitive.endsWith('are')) return '-are';
		if (infinitive.endsWith('ere')) return '-ere';
		if (infinitive.endsWith('ire')) return '-ire';
		return 'irregular';
	};

	const verbType = $derived(getVerbType(verb.infinitive));
	const stem = $derived(verb.infinitive.slice(0, -3));

	// Get conjugations based on tense
	const getConjugations = (): Record<string, string> | null => {
		switch (tense.id) {
			case 'presente':
				return verb.present ?? null;
			case 'futuro_semplice':
				return verb.future ?? null;
			case 'gerundio':
				return verb.gerund ? { form: verb.gerund } : null;
			case 'passato_prossimo':
				return verb.auxiliary && verb.pastParticiple
					? { auxiliary: verb.auxiliary, pastParticiple: verb.pastParticiple }
					: null;
			default:
				return null;
		}
	};

	const conjugations = $derived(getConjugations());
	const isIrregular = $derived(verb.irregular[tense.id] ?? false);

	// Regular endings for reference
	const regularEndings: Record<string, Record<string, string[]>> = {
		presente: {
			'-are': ['-o', '-i', '-a', '-iamo', '-ate', '-ano'],
			'-ere': ['-o', '-i', '-e', '-iamo', '-ete', '-ono'],
			'-ire': ['-o', '-i', '-e', '-iamo', '-ite', '-ono']
		},
		futuro_semplice: {
			'-are': ['-erò', '-erai', '-erà', '-eremo', '-erete', '-eranno'],
			'-ere': ['-erò', '-erai', '-erà', '-eremo', '-erete', '-eranno'],
			'-ire': ['-irò', '-irai', '-irà', '-iremo', '-irete', '-iranno']
		}
	};

	const gerundEndings: Record<string, string> = {
		'-are': '-ando',
		'-ere': '-endo',
		'-ire': '-endo'
	};

	// Build passato prossimo for each pronoun
	const buildPassatoProssimo = (pronoun: string): string => {
		if (!verb.auxiliary || !verb.pastParticiple) return '—';
		
		const auxConj: Record<string, Record<string, string>> = {
			avere: { io: 'ho', tu: 'hai', lui_lei: 'ha', noi: 'abbiamo', voi: 'avete', loro: 'hanno' },
			essere: { io: 'sono', tu: 'sei', lui_lei: 'è', noi: 'siamo', voi: 'siete', loro: 'sono' }
		};

		const aux = auxConj[verb.auxiliary][pronoun];
		let pp = verb.pastParticiple;

		// Essere verbs agree in gender/number - show masculine singular for simplicity
		if (verb.auxiliary === 'essere') {
			// For display, we'll show agreement markers
			if (pronoun === 'noi' || pronoun === 'voi' || pronoun === 'loro') {
				// Pluralize: -o → -i, -a → -e
				if (pp.endsWith('o')) pp = pp.slice(0, -1) + 'i';
				else if (pp.endsWith('a')) pp = pp.slice(0, -1) + 'e';
			}
		}

		return `${aux} ${pp}`;
	};
</script>

<div class="space-y-6">
	<!-- Verb Header -->
	<div class="rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div>
				<h3 class="text-2xl font-bold text-white">{verb.infinitive}</h3>
				<p class="mt-1 text-sm text-slate-400">{verb.translation}</p>
			</div>
			<div class="flex flex-wrap gap-2">
				<span
					class="rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-300"
				>
					{verbType}
				</span>
				{#if isIrregular}
					<span
						class="rounded-full border border-amber-500/40 bg-amber-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300"
					>
						Irregular
					</span>
				{:else}
					<span
						class="rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300"
					>
						Regular
					</span>
				{/if}
			</div>
		</div>
	</div>

	<!-- Formation Guide -->
	<div class="rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
		<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">How to form</p>
		
		{#if tense.id === 'presente' || tense.id === 'futuro_semplice'}
			<div class="mt-4 space-y-3">
				{#if isIrregular}
					<p class="text-sm text-slate-300">
						This verb is <span class="font-semibold text-amber-300">irregular</span> in the {tense.shortName.toLowerCase()} tense. 
						Memorize these forms:
					</p>
				{:else}
					<p class="text-sm text-slate-300">
						Take the stem <span class="rounded bg-slate-800 px-2 py-0.5 font-mono text-amber-300">{stem}</span>
						and add the {verbType} endings:
					</p>
					{#if regularEndings[tense.id]?.[verbType]}
						<div class="flex flex-wrap gap-2">
							{#each regularEndings[tense.id][verbType] as ending, i}
								<span class="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-sm">
									<span class="text-slate-500">{pronouns[i]}</span>
									<span class="ml-1 font-mono text-emerald-400">{ending}</span>
								</span>
							{/each}
						</div>
					{/if}
				{/if}
			</div>
		{:else if tense.id === 'gerundio'}
			<div class="mt-4 space-y-3">
				{#if isIrregular}
					<p class="text-sm text-slate-300">
						This verb has an <span class="font-semibold text-amber-300">irregular gerund</span>:
					</p>
				{:else}
					<p class="text-sm text-slate-300">
						Take the stem <span class="rounded bg-slate-800 px-2 py-0.5 font-mono text-amber-300">{stem}</span>
						and add <span class="font-mono text-emerald-400">{gerundEndings[verbType]}</span>
					</p>
				{/if}
			</div>
		{:else if tense.id === 'passato_prossimo'}
			<div class="mt-4 space-y-3">
				<p class="text-sm text-slate-300">
					Use the present tense of 
					<span class="font-semibold text-amber-300">{verb.auxiliary}</span>
					+ past participle 
					<span class="rounded bg-slate-800 px-2 py-0.5 font-mono text-amber-300">{verb.pastParticiple}</span>
				</p>
				{#if verb.auxiliary === 'essere'}
					<p class="text-xs text-slate-400">
						Note: With essere, the past participle agrees with the subject in gender and number.
					</p>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Conjugation Table -->
	<div class="rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
		<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Conjugation</p>
		
		{#if tense.id === 'gerundio'}
			<div class="mt-4">
				<div class="inline-block rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
					<span class="text-lg font-semibold text-white">{verb.gerund ?? '—'}</span>
				</div>
			</div>
		{:else if tense.id === 'passato_prossimo'}
			<div class="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
				{#each pronounKeys as key, i}
					<div class="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
						<span class="text-sm text-slate-400">{pronouns[i]}</span>
						<span class="font-semibold text-white">{buildPassatoProssimo(key)}</span>
					</div>
				{/each}
			</div>
		{:else if conjugations && typeof conjugations === 'object'}
			<div class="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
				{#each pronounKeys as key, i}
					{@const form = conjugations[key]}
					{#if form}
						<div class="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
							<span class="text-sm text-slate-400">{pronouns[i]}</span>
							<span class="font-semibold text-white">{form}</span>
						</div>
					{/if}
				{/each}
			</div>
		{:else}
			<p class="mt-4 text-sm text-slate-500">Conjugation data not available for this tense.</p>
		{/if}
	</div>

	<!-- Example Sentences -->
	<div class="rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
		<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Example</p>
		<div class="mt-4 space-y-2">
			{#if tense.id === 'presente' && conjugations}
				<p class="text-base text-white">
					Io <span class="font-semibold text-emerald-400">{conjugations.io}</span> ogni giorno.
				</p>
				<p class="text-sm text-slate-400">I {verb.translation.replace('to ', '')} every day.</p>
			{:else if tense.id === 'gerundio' && verb.gerund}
				<p class="text-base text-white">
					Sto <span class="font-semibold text-emerald-400">{verb.gerund}</span> adesso.
				</p>
				<p class="text-sm text-slate-400">I am {verb.translation.replace('to ', '')}ing now.</p>
			{:else if tense.id === 'passato_prossimo'}
				<p class="text-base text-white">
					Io <span class="font-semibold text-emerald-400">{buildPassatoProssimo('io')}</span> ieri.
				</p>
				<p class="text-sm text-slate-400">I {verb.translation.replace('to ', '')}ed yesterday.</p>
			{:else if tense.id === 'futuro_semplice' && conjugations}
				<p class="text-base text-white">
					Io <span class="font-semibold text-emerald-400">{conjugations.io}</span> domani.
				</p>
				<p class="text-sm text-slate-400">I will {verb.translation.replace('to ', '')} tomorrow.</p>
			{/if}
		</div>
	</div>
</div>
