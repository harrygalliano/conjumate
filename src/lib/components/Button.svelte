<script lang="ts" module>
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { type VariantProps, tv } from 'tailwind-variants';

	/**
	 * Conjumate Button Component
	 *
	 * Exact specs from Figma:
	 * - Font: Roboto, 500 weight, 16px (14px for small), line-height 1.5em, letter-spacing -0.31%
	 * - Border radius: 4px
	 * - Default padding: 8px 12px (vertical horizontal)
	 * - Gap between icon and text: 8px
	 * - Icon sizes: 24px (default), 16px (small)
	 *
	 * Colors:
	 * - Primary: #00A4BD (teal)
	 * - Hover/Active Text: #0C343C (dark teal)
	 * - Disabled: #CED6D7 (gray)
	 * - Focused bg (tertiary): #CEF2F4 (light teal)
	 * - Label text color: #3C5C62
	 */
	export const conjumateButtonVariants = tv({
		base: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-medium tracking-[-0.0031em] ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none aria-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0',
		variants: {
			variant: {
				// Primary: Solid teal background, white text
				primary:
					'bg-conjumate-teal text-white hover:bg-conjumate-dark focus-visible:ring-1 focus-visible:ring-conjumate-teal focus-visible:ring-offset-2 disabled:bg-conjumate-disabled disabled:text-white aria-disabled:bg-conjumate-disabled aria-disabled:text-white',
				// Secondary: Transparent with border
				secondary:
					'border border-conjumate-dark bg-transparent text-conjumate-dark hover:border-conjumate-teal hover:text-conjumate-teal focus-visible:ring-1 focus-visible:ring-conjumate-dark focus-visible:ring-offset-2 disabled:border-conjumate-disabled disabled:text-conjumate-disabled aria-disabled:border-conjumate-disabled aria-disabled:text-conjumate-disabled',
				// Tertiary: No border, transparent background
				tertiary:
					'bg-transparent text-conjumate-dark hover:text-conjumate-teal focus-visible:bg-conjumate-focus disabled:text-conjumate-disabled aria-disabled:text-conjumate-disabled',
				// Link: Like tertiary but focused shows underline
				link: 'bg-transparent text-conjumate-dark hover:text-conjumate-teal focus-visible:underline focus-visible:decoration-conjumate-dark focus-visible:underline-offset-2 disabled:text-conjumate-disabled aria-disabled:text-conjumate-disabled'
			},
			size: {
				default: 'h-10 px-3 py-2 text-base [&_svg]:size-6',
				small: 'h-8 px-3 py-1.5 text-sm [&_svg]:size-4',
				icon: 'size-10 p-2 [&_svg]:size-6',
				'icon-small': 'size-8 p-2 [&_svg]:size-4'
			},
			iconPosition: {
				none: '',
				leading: '',
				trailing: '',
				only: ''
			}
		},
		compoundVariants: [
			// Icon-only variants need square sizing
			{
				iconPosition: 'only',
				size: 'default',
				class: 'size-10 p-2'
			},
			{
				iconPosition: 'only',
				size: 'small',
				class: 'size-8 p-2'
			},
			// Secondary + small has black border per Figma
			{
				variant: 'secondary',
				size: 'small',
				class: 'border-black'
			}
		],
		defaultVariants: {
			variant: 'primary',
			size: 'default',
			iconPosition: 'none'
		}
	});

	export type ConjumateButtonVariant = VariantProps<typeof conjumateButtonVariants>['variant'];
	export type ConjumateButtonSize = VariantProps<typeof conjumateButtonVariants>['size'];
	export type ConjumateButtonIconPosition = VariantProps<typeof conjumateButtonVariants>['iconPosition'];

	export type ConjumateButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ConjumateButtonVariant;
			size?: ConjumateButtonSize;
			iconPosition?: ConjumateButtonIconPosition;
			leadingIcon?: Snippet;
			trailingIcon?: Snippet;
			loading?: boolean;
		};
</script>

<script lang="ts">
	import { RotateCw } from '@lucide/svelte';

	let {
		class: className,
		variant = 'primary',
		size = 'default',
		iconPosition = 'none',
		leadingIcon,
		trailingIcon,
		loading = false,
		ref = $bindable(null),
		href = undefined,
		type = 'button',
		disabled,
		onclick,
		children,
		...restProps
	}: ConjumateButtonProps = $props();

	// Determine icon position based on provided snippets if not explicitly set
	const effectiveIconPosition = $derived.by(() => {
		if (iconPosition !== 'none') return iconPosition;
		if ((leadingIcon || trailingIcon) && !children) return 'only';
		if (leadingIcon || loading) return 'leading';
		if (trailingIcon) return 'trailing';
		return 'none';
	});

	// Auto-disable when loading
	const isDisabled = $derived(disabled || loading);
</script>

{#snippet spinner()}
	<RotateCw class="animate-spin" />
{/snippet}

{#snippet buttonContent()}
	{#if loading}
		{@render spinner()}
	{:else if leadingIcon && effectiveIconPosition !== 'only'}
		{@render leadingIcon()}
	{/if}
	{#if effectiveIconPosition === 'only'}
		{#if loading}
			{@render spinner()}
		{:else if leadingIcon}
			{@render leadingIcon()}
		{:else if trailingIcon}
			{@render trailingIcon()}
		{/if}
	{:else}
		{@render children?.()}
	{/if}
	{#if trailingIcon && effectiveIconPosition !== 'only'}
		{@render trailingIcon()}
	{/if}
{/snippet}

{#if href}
	<a
		bind:this={ref}
		data-slot="conjumate-button"
		class={cn(
			conjumateButtonVariants({ variant, size, iconPosition: effectiveIconPosition }),
			className
		)}
		href={isDisabled ? undefined : href}
		aria-disabled={isDisabled || undefined}
		aria-busy={loading || undefined}
		role={isDisabled ? 'link' : undefined}
		tabindex={isDisabled ? -1 : undefined}
		onclick={(e) => {
			if (isDisabled) {
				e.preventDefault();
				return;
			}
			onclick?.(e);
		}}
		{...restProps}
	>
		{@render buttonContent()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="conjumate-button"
		class={cn(
			conjumateButtonVariants({ variant, size, iconPosition: effectiveIconPosition }),
			className
		)}
		{type}
		disabled={isDisabled}
		aria-busy={loading || undefined}
		{onclick}
		{...restProps}
	>
		{@render buttonContent()}
	</button>
{/if}
