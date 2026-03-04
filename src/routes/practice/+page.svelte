<script lang="ts">
	import {
		ConjugationQuiz,
		TenseBlurb,
		TenseSelect,
		VerbList
	} from '$lib/components/quiz';
	import { TENSES, italianVerbs } from '$lib/data/italian';

	let selectedTense = $state(TENSES[0].id);
	const currentTense = $derived(TENSES.find((tense) => tense.id === selectedTense) ?? TENSES[0]);
</script>

<svelte:head>
	<title>Conjumate · Practice</title>
</svelte:head>

<div class="min-h-[100svh] bg-gradient-to-b from-amber-50 via-white to-slate-100">
	<main class="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10">
		<header class="space-y-3">
			<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
				Conjumate Practice
			</p>
			<h1 class="text-3xl font-semibold text-slate-900 sm:text-4xl">
				Italian Tense Trainer
			</h1>
			<p class="text-base text-slate-600 sm:text-lg">
				Pick a tense, review the quick explainer, then sprint through conjugations for
				one minute.
			</p>
		</header>

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

		<VerbList verbs={italianVerbs} />
	</main>
</div>
