import { useEffect, useState } from 'react';

type Breakpoint = 'sm' | 'md' | 'lg';

export function useBreakpoint(): Breakpoint {
	const [breakpoint, setBreakpoint] = useState<Breakpoint>('md');

	useEffect(() => {
		const smQuery = window.matchMedia('(max-width: 599px)');
		const mdQuery = window.matchMedia('(min-width: 600px) and (max-width: 999px)');
		const lgQuery = window.matchMedia('(min-width: 1000px)');

		const updateBreakpoint = () => {
			if (smQuery.matches) setBreakpoint('sm');
			else if (mdQuery.matches) setBreakpoint('md');
			else if (lgQuery.matches) setBreakpoint('lg');
		};

		// Initialer Aufruf
		updateBreakpoint();

		// Event Listener hinzufügen
		smQuery.addEventListener('change', updateBreakpoint);
		mdQuery.addEventListener('change', updateBreakpoint);
		lgQuery.addEventListener('change', updateBreakpoint);

		// Cleanup
		return () => {
			smQuery.removeEventListener('change', updateBreakpoint);
			mdQuery.removeEventListener('change', updateBreakpoint);
			lgQuery.removeEventListener('change', updateBreakpoint);
		};
	}, []);

	return breakpoint;
}
