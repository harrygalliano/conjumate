<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let { children } = $props();
	let isMenuOpen = $state(false);

	const navLinks = [
		{ href: '/', label: 'Home', description: 'Landing' },
		{ href: '/learn', label: 'Learn', description: 'Grammar guides' },
		{ href: '/practice#grammar', label: 'Grammar', description: 'Conjugation sprints' },
		{ href: '/practice#vocab', label: 'Vocab', description: 'Colors + numbers' }
	];

	const isActiveLink = (href: string) => {
		const url = $page.url;

		if (href === '/') return url.pathname === '/';
		if (href === '/learn') return url.pathname === '/learn';
		if (href.startsWith('/practice')) {
			if (url.pathname !== '/practice') return false;
			if (href.includes('#vocab')) return url.hash === '#vocab';
			if (href.includes('#grammar')) return url.hash === '#grammar' || url.hash === '';
			return true;
		}

		return url.pathname === href;
	};

	const closeMenu = () => {
		isMenuOpen = false;
	};

	onMount(() => {
		if (!import.meta.env.PROD) return;
		if (!('serviceWorker' in navigator)) return;

		navigator.serviceWorker.register('/service-worker.js');
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-[100svh]">
	<div class="sticky top-0 z-40 flex items-center justify-between border-b border-slate-900/60 bg-slate-950/90 px-4 py-3 text-slate-100 backdrop-blur lg:hidden">
		<div class="flex items-center gap-3">
			<div class="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-sm font-bold text-slate-900">
				C
			</div>
			<div class="text-xs uppercase tracking-[0.3em] text-amber-300">Conjumate</div>
		</div>
		<button
			type="button"
			class="rounded-full border border-slate-700 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
			aria-label="Toggle navigation"
			aria-expanded={isMenuOpen}
			onclick={() => (isMenuOpen = !isMenuOpen)}
		>
			Menu
		</button>
	</div>

	{#if isMenuOpen}
		<button
			type="button"
			class="fixed inset-0 z-40 bg-slate-950/70"
			aria-label="Close navigation"
			onclick={closeMenu}
		></button>
		<aside class="fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-slate-100 shadow-2xl">
			<div class="flex items-center justify-between border-b border-slate-800 px-6 py-5">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-base font-bold text-slate-900">
						C
					</div>
					<div>
						<p class="text-xs uppercase tracking-[0.3em] text-amber-300">Conjumate</p>
						<p class="text-xs text-slate-400">Italian trainer</p>
					</div>
				</div>
				<button
					type="button"
					class="rounded-full border border-slate-700 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
					onclick={closeMenu}
				>
					Close
				</button>
			</div>
			<nav class="px-6 py-4" aria-label="Mobile navigation">
				<div class="space-y-2">
					{#each navLinks as link (link.href)}
						<a
							href={link.href}
							onclick={closeMenu}
							class={`flex flex-col gap-1 rounded-2xl border px-4 py-3 text-left transition ${
								isActiveLink(link.href)
									? 'border-amber-400/40 bg-amber-400/10 text-white'
									: 'border-slate-800 bg-slate-900/60 text-slate-200 hover:border-slate-600'
							}`}
						>
							<span class="text-sm font-semibold uppercase tracking-[0.2em]">
								{link.label}
							</span>
							<span class="text-xs text-slate-400">{link.description}</span>
						</a>
					{/each}
				</div>
			</nav>
		</aside>
	{/if}

	<div class="lg:grid lg:grid-cols-[240px_1fr] lg:gap-6">
		<aside class="hidden lg:flex lg:flex-col lg:gap-4 lg:pl-6 lg:pt-8">
			<nav class="rounded-3xl border border-slate-800 bg-slate-950/95 p-5 text-slate-100 shadow-xl">
				<p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
					Navigate
				</p>
				<div class="mt-4 space-y-2">
					{#each navLinks as link (link.href)}
						<a
							href={link.href}
							class={`flex flex-col gap-1 rounded-2xl border px-4 py-3 text-left transition ${
								isActiveLink(link.href)
									? 'border-amber-400/40 bg-amber-400/10 text-white'
									: 'border-slate-800 bg-slate-900/60 text-slate-200 hover:border-slate-600'
							}`}
						>
							<span class="text-sm font-semibold uppercase tracking-[0.2em]">
								{link.label}
							</span>
							<span class="text-xs text-slate-400">{link.description}</span>
						</a>
					{/each}
				</div>
			</nav>
		</aside>

		<div class="min-h-[100svh] lg:pr-6 lg:pt-8">{@render children()}</div>
	</div>
</div>
