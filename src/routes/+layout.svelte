<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		if (!import.meta.env.PROD) return;
		if (!('serviceWorker' in navigator)) return;

		navigator.serviceWorker.register('/service-worker.js');
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
