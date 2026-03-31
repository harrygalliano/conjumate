<script lang="ts">
	import type { ArticleModeId, ArticlePracticeMode } from '$lib/data/articlePractice';

	let {
		modes,
		value = $bindable()
	}: {
		modes: readonly ArticlePracticeMode[];
		value: ArticleModeId;
	} = $props();
</script>

<div class="space-y-2">
	<label class="text-sm font-semibold tracking-wide text-slate-500 uppercase" for="article-mode">
		Article Type
	</label>
	<select
		id="article-mode"
		class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base shadow-sm focus:border-slate-400 focus:outline-none"
		disabled={modes.length === 1}
		bind:value
	>
		{#each modes as mode (mode.id)}
			<option value={mode.id}>{mode.name}</option>
		{/each}
	</select>
</div>
