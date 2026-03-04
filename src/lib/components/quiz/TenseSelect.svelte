<script lang="ts">
	import type { TenseDefinition } from '$lib/data/italian';

	let { tenses, value = $bindable() }: { tenses: TenseDefinition[]; value: string } = $props();
</script>

<div class="space-y-2">
	<label class="text-sm font-semibold uppercase tracking-wide text-slate-500" for="tense">
		Tense
	</label>
	<select
		id="tense"
		class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base shadow-sm focus:border-slate-400 focus:outline-none"
		disabled={tenses.length === 1}
		bind:value
	>
		{#each tenses as tense (tense.id)}
			<option value={tense.id}>{tense.name}</option>
		{/each}
	</select>
</div>
