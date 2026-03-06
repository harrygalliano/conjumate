<script lang="ts">
	let {
		hour,
		minute,
		size = 120,
		className = 'text-slate-700'
	}: { hour: number; minute: number; size?: number; className?: string } = $props();

	const ticks = Array.from({ length: 12 }, (_, index) => index);
	const minuteAngle = $derived(minute * 6);
	const hourAngle = $derived(((hour % 12) + minute / 60) * 30);
</script>

<svg viewBox="0 0 100 100" width={size} height={size} aria-label={`${hour}:${minute}`}
	class={className}>
	<circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" stroke-width="4" />

	{#each ticks as tick (tick)}
		<line
			x1="50"
			y1="8"
			x2="50"
			y2="14"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			transform={`rotate(${tick * 30} 50 50)`}
		/>
	{/each}

	<line
		x1="50"
		y1="50"
		x2="50"
		y2="22"
		stroke="currentColor"
		stroke-width="5"
		stroke-linecap="round"
		transform={`rotate(${hourAngle} 50 50)`}
	/>
	<line
		x1="50"
		y1="50"
		x2="50"
		y2="14"
		stroke="currentColor"
		stroke-width="3"
		stroke-linecap="round"
		transform={`rotate(${minuteAngle} 50 50)`}
	/>
	<circle cx="50" cy="50" r="4" fill="currentColor" />
</svg>
