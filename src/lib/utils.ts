import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx and tailwind-merge.
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

/**
 * Utility type to add an element ref to component props.
 */
export type WithElementRef<T, El extends HTMLElement = HTMLElement> = T & {
	ref?: El | null;
};
