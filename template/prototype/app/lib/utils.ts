import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const prefersReducedMotion =
	typeof window === 'undefined'
		? true
		: window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * View Transition API compatibility layer for non-browser environments.
 */
export const viewTransition =
	!prefersReducedMotion && globalThis.document && 'startViewTransition' in document
		? globalThis.document.startViewTransition.bind(globalThis.document)
		: (cb: () => void) => cb();

/**
 * Konvertiert einen String in einen URL-sicheren Slug
 * @param input - Der zu konvertierende String
 * @returns Ein URL-sicherer Slug
 */
export const createSlug = (input: string): string => {
	return input
		.toLowerCase()
		.replace(/ä/g, 'ae')
		.replace(/ö/g, 'oe')
		.replace(/ü/g, 'ue')
		.replace(/ß/g, 'ss')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
};
