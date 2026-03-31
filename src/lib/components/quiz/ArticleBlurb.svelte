<script lang="ts">
	import type { ArticlePracticeMode } from '$lib/data/articlePractice';
	import type { ArticleGuide } from '$lib/data/learn/articles';

	type GuideForm = ArticleGuide['forms'][number];

	let {
		mode,
		guide
	}: {
		mode: ArticlePracticeMode;
		guide: ArticleGuide;
	} = $props();

	const visibleForms = $derived<GuideForm[]>(
		guide.forms.filter((form) => mode.articles.includes(form.article))
	);
</script>

<section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
	<div class="flex flex-col gap-2">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<div>
				<p class="text-xs font-semibold tracking-[0.2em] text-amber-500 uppercase">
					{mode.shortName}
				</p>
				<h2 class="text-2xl font-semibold text-slate-900">{mode.name}</h2>
			</div>
			<a
				href={`/learn/${guide.slug}`}
				class="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-slate-600 uppercase transition hover:border-slate-400 hover:text-slate-900"
			>
				Open Lesson
			</a>
		</div>

		<div class="mt-1 flex flex-wrap gap-2">
			{#each visibleForms as form (form.article + form.label)}
				<span
					class="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800"
				>
					{form.article}
				</span>
			{/each}
		</div>

		<div class="space-y-3 text-base text-slate-600">
			{#each guide.description as line, index (index)}
				<p>{line}</p>
			{/each}
		</div>

		<ul class="mt-2 space-y-3">
			{#each guide.examples as example (example.italian)}
				<li class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
					<p class="text-base font-semibold text-slate-900">{example.italian}</p>
					<p class="text-sm text-slate-500">{example.english}</p>
				</li>
			{/each}
		</ul>

		<div class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
			<p class="font-semibold">{mode.quickRule}</p>
			{#each guide.tips as tip (tip)}
				<p class="mt-2">{tip}</p>
			{/each}
		</div>
	</div>
</section>
