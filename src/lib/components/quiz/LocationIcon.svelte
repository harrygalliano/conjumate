<script lang="ts">
	import type { LocationWord } from '$lib/data/vocab';

	let { word }: { word: LocationWord } = $props();

	const box = { x: 35, y: 35, w: 30, h: 30 };

	const dotPos = (w: LocationWord) => {
		switch (w) {
			case 'sopra':
				return { x: 50, y: 15 };
			case 'sotto':
				return { x: 50, y: 85 };
			case 'su':
				return { x: 50, y: 32 };
			case 'giù':
				return { x: 50, y: 92 };

			case 'davanti':
				return { x: 78, y: 50 };
			case 'dietro':
				return { x: 22, y: 50 };

			case 'accanto':
				return { x: 78, y: 50 };
			case 'vicino':
				return { x: 70, y: 50 };
			case 'lontano':
				return { x: 95, y: 50 };

			case 'dentro':
				return { x: 50, y: 50 };
			case 'fuori':
				return { x: 15, y: 50 };

			case 'tra':
			case 'fra':
				return { x: 50, y: 50 };

			case 'oltre':
				return { x: 90, y: 50 };
			case 'verso':
				return { x: 72, y: 50 };

			case 'in':
				return { x: 50, y: 50 };
			case 'a':
				return { x: 62, y: 50 };
			case 'da':
				return { x: 38, y: 50 };
			case 'di':
				return { x: 50, y: 50 };
			case 'per':
				return { x: 50, y: 50 };

			default:
				return { x: 50, y: 15 };
		}
	};

	const p = $derived(dotPos(word));
</script>

<svg viewBox="0 0 100 100" width="96" height="96" aria-label={word} class="text-slate-700">
	<!-- reference object -->
	<rect
		x={box.x}
		y={box.y}
		width={box.w}
		height={box.h}
		rx="6"
		fill="none"
		stroke="currentColor"
		stroke-width="4"
	/>

	<!-- special: tra/fra -> two objects -->
	{#if word === 'tra' || word === 'fra'}
		<rect
			x="15"
			y="40"
			width="20"
			height="20"
			rx="5"
			fill="none"
			stroke="currentColor"
			stroke-width="4"
		/>
		<rect
			x="65"
			y="40"
			width="20"
			height="20"
			rx="5"
			fill="none"
			stroke="currentColor"
			stroke-width="4"
		/>
		<circle cx="50" cy="50" r="6" fill="#ef4444" />
	{:else}
		<!-- target dot -->
		<circle cx={p.x} cy={p.y} r="6" fill="#ef4444" />
	{/if}

	<!-- per (through) -> path line -->
	{#if word === 'per'}
		<path d="M10 50 H90" stroke="#ef4444" stroke-width="4" stroke-linecap="round" />
		<path
			d="M86 44 L92 50 L86 56"
			fill="none"
			stroke="#ef4444"
			stroke-width="4"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	{/if}

	<!-- verso (towards) -> arrow toward box -->
	{#if word === 'verso'}
		<path d="M10 50 H34" stroke="#ef4444" stroke-width="4" stroke-linecap="round" />
		<path
			d="M30 44 L36 50 L30 56"
			fill="none"
			stroke="#ef4444"
			stroke-width="4"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	{/if}

	<!-- oltre (beyond) -> arrow past box -->
	{#if word === 'oltre'}
		<path d="M66 50 H92" stroke="#ef4444" stroke-width="4" stroke-linecap="round" />
		<path
			d="M88 44 L94 50 L88 56"
			fill="none"
			stroke="#ef4444"
			stroke-width="4"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	{/if}
</svg>
