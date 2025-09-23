import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Class-Name-Utility that supports TailwindCSS merge */
export function cn(...inputs: ClassValue[]): string {
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
