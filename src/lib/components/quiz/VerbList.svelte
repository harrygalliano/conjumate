<script lang="ts">
	import type { Verb } from '$lib/data/italian';

	let { verbs, label = 'Verb list' }: { verbs: Verb[]; label?: string } = $props();
</script>

<section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
	<div class="flex items-center justify-between gap-3">
		<h3 class="text-xl font-semibold text-slate-900">Popular Verbs</h3>
		<p class="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
	</div>
	<div class="mt-4 grid gap-2">
		<div class="grid grid-cols-[1.2fr_1fr_0.8fr] gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
			<span>Verb</span>
			<span>Meaning</span>
			<span>Aux</span>
		</div>
		<div class="max-h-72 space-y-2 overflow-auto pr-1">
			{#each verbs as verb (verb.infinitive)}
				<div class="grid grid-cols-[1.2fr_1fr_0.8fr] gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
					<span class="font-semibold text-slate-900">{verb.infinitive}</span>
					<span>{verb.translation}</span>
					<span class="uppercase text-slate-500">{verb.auxiliary}</span>
				</div>
			{/each}
		</div>
	</div>
</section>
