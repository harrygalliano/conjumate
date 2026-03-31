<script lang="ts">
	import type { ArticleGuide } from '$lib/data/learn/articles';

	let {
		guide,
		companion
	}: {
		guide: ArticleGuide;
		companion: ArticleGuide;
	} = $props();
</script>

<svelte:head>
	<title>Conjumate · {guide.name}</title>
</svelte:head>

<div
	class="min-h-[100svh] bg-gradient-to-br from-slate-950 via-[#0b1020] to-[#140b2a] text-slate-100"
>
	<main class="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10">
		<div class="flex flex-wrap items-center gap-3 text-sm text-slate-400">
			<a
				href="/learn"
				class="rounded-full border border-slate-700 px-3 py-1 transition hover:border-slate-500 hover:text-white"
			>
				Back to learn
			</a>
			<span>/</span>
			<span>{guide.name}</span>
		</div>

		<header class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
			<p class="text-xs font-semibold tracking-[0.3em] text-amber-300 uppercase">Article Guide</p>
			<h1 class="mt-3 text-3xl font-semibold text-white sm:text-4xl">{guide.name}</h1>
			<p class="mt-3 max-w-3xl text-base text-slate-300 sm:text-lg">{guide.summary}</p>
			<div class="mt-6 flex flex-wrap gap-3">
				<div class="rounded-2xl border border-slate-700 bg-slate-950/60 px-4 py-3">
					<p class="text-xs tracking-[0.2em] text-slate-400 uppercase">Focus</p>
					<p class="mt-1 text-sm font-semibold text-white">{guide.focus}</p>
				</div>
				<a
					href={`/learn/${companion.slug}`}
					class="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-200 transition hover:bg-amber-400/20"
				>
					Read next: {companion.name}
				</a>
			</div>
		</header>

		<section class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
			<div class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
				<p class="text-xs font-semibold tracking-[0.3em] text-amber-300 uppercase">How It Works</p>
				<div class="mt-4 space-y-3 text-sm text-slate-300">
					{#each guide.description as line, index (index)}
						<p>{line}</p>
					{/each}
				</div>
			</div>

			<div class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
				<p class="text-xs font-semibold tracking-[0.3em] text-amber-300 uppercase">Quick Rule</p>
				<p class="mt-4 text-sm text-slate-300">
					Start with the noun's gender and number, then check the first sound. That tells you which
					article family to use.
				</p>
				<div class="mt-4 rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
					<p class="text-xs tracking-[0.2em] text-slate-400 uppercase">Pattern</p>
					<p class="mt-2 text-base font-semibold text-white">
						gender + number + first sound -> article
					</p>
				</div>
			</div>
		</section>

		<section class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
			<p class="text-xs font-semibold tracking-[0.3em] text-amber-300 uppercase">Forms</p>
			<div class="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
				{#each guide.forms as form (form.article + form.label)}
					<div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
						<p class="text-2xl font-semibold text-white">{form.article}</p>
						<p class="mt-1 text-sm font-semibold text-amber-300">{form.label}</p>
						<p class="mt-2 text-sm text-slate-300">{form.use}</p>
						<p class="mt-3 text-xs tracking-[0.2em] text-slate-500 uppercase">Examples</p>
						<div class="mt-2 flex flex-wrap gap-2">
							{#each form.examples as example (example)}
								<span
									class="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200"
								>
									{example}
								</span>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section class="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
			<div class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
				<p class="text-xs font-semibold tracking-[0.3em] text-amber-300 uppercase">Examples</p>
				<ul class="mt-4 space-y-3">
					{#each guide.examples as example (example.italian)}
						<li class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
							<p class="text-base font-semibold text-white">{example.italian}</p>
							<p class="text-sm text-slate-400">{example.english}</p>
						</li>
					{/each}
				</ul>
			</div>

			<div class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
				<p class="text-xs font-semibold tracking-[0.3em] text-amber-300 uppercase">Tips</p>
				<ul class="mt-4 space-y-2 text-sm text-slate-300">
					{#each guide.tips as tip, index (index)}
						<li class="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">{tip}</li>
					{/each}
				</ul>
			</div>
		</section>
	</main>
</div>
