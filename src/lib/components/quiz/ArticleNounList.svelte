<script lang="ts">
	import {
		buildArticlePhrase,
		getArticleMode,
		type ArticleModeId,
		type ArticleNoun
	} from '$lib/data/articlePractice';

	let {
		nouns,
		articleMode,
		label = 'Article list'
	}: {
		nouns: ArticleNoun[];
		articleMode: ArticleModeId;
		label?: string;
	} = $props();

	const currentMode = $derived(getArticleMode(articleMode));
</script>

<section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
	<div class="flex items-center justify-between gap-3">
		<div>
			<h3 class="text-xl font-semibold text-slate-900">Common Nouns</h3>
			<p class="text-sm text-slate-500">{nouns.length} shared prompts for article drills</p>
		</div>
		<p class="text-xs tracking-[0.2em] text-slate-400 uppercase">{label}</p>
	</div>

	<div class="mt-4 grid gap-2">
		<div
			class="grid grid-cols-[1fr_0.9fr_1.3fr] gap-2 text-xs font-semibold tracking-wide text-slate-500 uppercase"
		>
			<span>Noun</span>
			<span>Meaning</span>
			<span>{currentMode.name}</span>
		</div>
		<div class="max-h-72 space-y-2 overflow-auto pr-1">
			{#each nouns as noun (noun.singular)}
				<div
					class="grid grid-cols-[1fr_0.9fr_1.3fr] gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
				>
					<span class="font-semibold text-slate-900">
						{noun.singular} / {noun.plural}
					</span>
					<span>{noun.english}</span>
					<span>{buildArticlePhrase(articleMode, noun)}</span>
				</div>
			{/each}
		</div>
	</div>
</section>
