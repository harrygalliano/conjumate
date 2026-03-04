<script lang="ts">
	import type { TenseDefinition } from '$lib/data/italian';

	let { tense }: { tense: TenseDefinition } = $props();
</script>

<section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
	<div class="flex flex-col gap-2">
		<p class="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
			{tense.shortName}
		</p>
		<h2 class="text-2xl font-semibold text-slate-900">{tense.name}</h2>
		<div class="space-y-3 text-base text-slate-600">
			{#each tense.description as line, index (index)}
				<p>{line}</p>
			{/each}
		</div>
		<ul class="mt-2 space-y-3">
			{#each tense.examples as example (example.italian)}
				<li class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
					<p class="text-base font-semibold text-slate-900">{example.italian}</p>
					<p class="text-sm text-slate-500">{example.english}</p>
				</li>
			{/each}
		</ul>
		{#if tense.notes?.length}
			<div class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
				{#each tense.notes as note, index (index)}
					<p>{note}</p>
				{/each}
			</div>
		{/if}
	</div>
</section>
