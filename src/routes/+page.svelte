<script lang="ts">
	const navLinks = [
		{ href: '#method', label: 'Method' },
		{ href: '#tense', label: 'Tense Focus' },
		{ href: '#offline', label: 'Offline' },
		{ href: '/practice', label: 'Practice' }
	];

	const highlights = [
		{ title: '60 seconds', detail: 'Timed recall sprints' },
		{ title: 'Top 28 verbs', detail: 'Built-in verb set' },
		{ title: 'Offline ready', detail: 'No signal required' }
	];

	const features = [
		{
			title: 'One-minute sprints',
			description: 'Fast prompts keep your recall sharp without feeling heavy.',
			meta: 'Timed rounds'
		},
		{
			title: 'Tense-first learning',
			description: 'Master one tense at a time before stacking new rules.',
			meta: 'Focused progress'
		},
		{
			title: 'Audio-ready',
			description: 'Save audio offline and drill pronunciation anywhere.',
			meta: 'Planned'
		}
	];

	const steps = [
		{
			title: 'Pick a tense',
			description: 'Start with the present perfect (passato prossimo).'
		},
		{
			title: 'Scan the pattern',
			description: 'Auxiliary + past participle, with quick examples.'
		},
		{
			title: 'Sprint & score',
			description: 'Race the clock and track your accuracy.'
		}
	];

	const examples = [
		{ italian: 'Io ho mangiato una pizza.', english: 'I ate a pizza.' },
		{ italian: 'Lei ha studiato italiano.', english: 'She studied Italian.' },
		{ italian: 'Noi siamo arrivati tardi.', english: 'We arrived late.' }
	];
</script>

<svelte:head>
	<title>Conjumate · Learn Italian Offline</title>
</svelte:head>

<div class="min-h-[100svh] bg-slate-950 text-slate-100">
	<div class="relative overflow-hidden">
		<div class="absolute -left-32 top-10 h-64 w-64 rounded-full bg-amber-400/30 blur-3xl"></div>
		<div class="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"></div>
		<div class="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"></div>

		<header class="relative z-10 px-4 pt-8">
			<nav class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
				<div class="flex items-center gap-3">
					<div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400 text-lg font-bold text-slate-900">
						C
					</div>
					<div>
						<p class="text-sm uppercase tracking-[0.25em] text-amber-300">Conjumate</p>
						<p class="text-xs text-slate-400">Italian verb trainer</p>
					</div>
				</div>
				<div class="hidden items-center gap-6 text-sm text-slate-300 md:flex">
					{#each navLinks as link (link.href)}
						<a class="transition hover:text-white" href={link.href}>{link.label}</a>
					{/each}
				</div>
				<div class="flex items-center gap-3">
					<a
						href="/practice"
						class="hidden rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-slate-500 sm:inline-flex"
					>
						Preview
					</a>
					<a
						href="/practice"
						class="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
					>
						Start Sprint
					</a>
				</div>
			</nav>
		</header>

		<main class="relative z-10 px-4 pb-16 pt-12">
			<section class="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
				<div class="space-y-8">
					<div class="space-y-4">
						<p class="text-xs font-semibold uppercase tracking-[0.4em] text-amber-300">
							Offline Italian
						</p>
						<h1 class="text-4xl font-semibold leading-tight text-white sm:text-5xl">
							Build fast Italian recall with 60-second verb sprints.
						</h1>
						<p class="max-w-xl text-base text-slate-300 sm:text-lg">
							Conjumate is a mobile-first drill space for the passato prossimo. Learn the
							pattern, then race the clock on high-frequency verbs.
						</p>
					</div>
					<div class="flex flex-wrap gap-3">
						<a
							href="/practice"
							class="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900"
						>
							Start a sprint
						</a>
						<a
							href="#method"
							class="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100"
						>
							See the method
						</a>
					</div>
					<div class="grid gap-3 sm:grid-cols-3">
						{#each highlights as item (item.title)}
							<div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
								<p class="text-lg font-semibold text-white">{item.title}</p>
								<p class="text-xs uppercase tracking-[0.18em] text-slate-400">
									{item.detail}
								</p>
							</div>
						{/each}
					</div>
				</div>
				<div class="space-y-6">
					<div class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/30">
						<p class="text-xs uppercase tracking-[0.3em] text-amber-300">Passato prossimo</p>
						<h2 class="mt-3 text-2xl font-semibold text-white">Present Perfect Focus</h2>
						<p class="mt-2 text-sm text-slate-300">
							Present of <span class="text-amber-200">avere/essere</span> + past participle.
						</p>
						<div class="mt-4 space-y-3">
							{#each examples as example (example.italian)}
								<div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
									<p class="text-base font-semibold text-white">{example.italian}</p>
									<p class="text-xs uppercase tracking-[0.2em] text-slate-400">
										{example.english}
									</p>
								</div>
							{/each}
						</div>
					</div>
					<div class="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-950 p-6">
						<p class="text-xs uppercase tracking-[0.3em] text-slate-400">Next up</p>
						<p class="mt-3 text-sm text-slate-300">
							We will expand to imperfetto, futuro semplice, and conditional, each with
							its own sprint mode.
						</p>
					</div>
				</div>
			</section>
		</main>
	</div>
</div>

<section id="method" class="bg-slate-50 px-4 py-16 text-slate-900">
	<div class="mx-auto w-full max-w-6xl">
		<div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
			<div class="space-y-6">
				<p class="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
					Method
				</p>
				<h2 class="text-3xl font-semibold">A simple loop: learn, sprint, repeat.</h2>
				<p class="text-base text-slate-600">
					Conjumate keeps you in motion: short reviews, high-frequency verbs, and
					instant feedback. Every round is a small win.
				</p>
				<div class="grid gap-3">
					{#each steps as step, index (step.title)}
						<div class="rounded-2xl border border-slate-200 bg-white p-4">
							<p class="text-xs uppercase tracking-[0.2em] text-amber-500">
								Step {index + 1}
							</p>
							<p class="mt-2 text-lg font-semibold text-slate-900">{step.title}</p>
							<p class="text-sm text-slate-600">{step.description}</p>
						</div>
					{/each}
				</div>
			</div>
			<div class="grid gap-4">
				{#each features as feature (feature.title)}
					<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
						<p class="text-xs uppercase tracking-[0.2em] text-slate-400">{feature.meta}</p>
						<p class="mt-2 text-xl font-semibold text-slate-900">{feature.title}</p>
						<p class="mt-2 text-sm text-slate-600">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<section id="tense" class="bg-white px-4 py-16">
	<div class="mx-auto w-full max-w-6xl">
		<div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
			<div class="space-y-3">
				<p class="text-xs font-semibold uppercase tracking-[0.4em] text-amber-500">
					Tense Focus
				</p>
				<h2 class="text-3xl font-semibold text-slate-900">
					Present perfect, powered by real verbs.
				</h2>
				<p class="max-w-xl text-base text-slate-600">
					We start with verbs you actually need for daily conversation. Stay tuned for
					future tense packs you can download for offline practice.
				</p>
			</div>
			<div class="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
				<p class="text-xs uppercase tracking-[0.2em] text-slate-400">Verb set</p>
				<p class="mt-2 text-2xl font-semibold text-slate-900">28 high-frequency verbs</p>
				<p class="mt-2">
					Balanced between essere + avere, perfect for building intuition.
				</p>
			</div>
		</div>
	</div>
</section>

<section id="offline" class="bg-slate-950 px-4 py-16 text-slate-100">
	<div class="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
		<div class="space-y-4">
			<p class="text-xs font-semibold uppercase tracking-[0.4em] text-amber-300">
				Offline first
			</p>
			<h2 class="text-3xl font-semibold">Your drills, even without signal.</h2>
			<p class="text-base text-slate-300">
				Install Conjumate as a PWA, cache lessons and audio, and train on the subway or
				in airplane mode.
			</p>
			<div class="flex flex-wrap gap-3">
				<span class="rounded-full bg-slate-900 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
					PWA install
				</span>
				<span class="rounded-full bg-slate-900 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
					IndexedDB progress
				</span>
				<span class="rounded-full bg-slate-900 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
					Audio cache
				</span>
			</div>
		</div>
		<div class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
			<p class="text-xs uppercase tracking-[0.3em] text-slate-400">Offline pack</p>
			<p class="mt-3 text-xl font-semibold text-white">Save your favorite drills</p>
			<p class="mt-2 text-sm text-slate-300">
				Download a tense pack once, then practice without a connection. Your scores
				sync back when you are online again.
			</p>
		</div>
	</div>
</section>

<section id="start" class="bg-white px-4 py-16">
	<div class="mx-auto w-full max-w-6xl">
		<div class="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-900 sm:p-12">
			<div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
				<div class="space-y-4">
					<p class="text-xs font-semibold uppercase tracking-[0.4em] text-amber-500">
						Start here
					</p>
					<h2 class="text-3xl font-semibold">Ready for your first sprint?</h2>
					<p class="text-base text-slate-600">
						Jump into the present perfect and see how many conjugations you can
						complete in 60 seconds.
					</p>
				</div>
				<div class="flex flex-col justify-center gap-3">
					<a
						href="/practice"
						class="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
					>
						Start sprint
					</a>
					<p class="text-xs uppercase tracking-[0.2em] text-slate-400">
						Timed mode: 60 seconds
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<footer class="bg-slate-950 px-4 py-10 text-slate-500">
	<div class="mx-auto flex w-full max-w-6xl flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
		<p>Conjumate (c) 2026. Learn Italian, offline.</p>
		<div class="flex items-center gap-4">
			<a class="hover:text-slate-200" href="#method">Method</a>
			<a class="hover:text-slate-200" href="#offline">Offline</a>
			<a class="hover:text-slate-200" href="/practice">Practice</a>
		</div>
	</div>
</footer>
