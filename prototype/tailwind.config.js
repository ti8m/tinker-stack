import baseConfig from '@repo/ui/tailwind.config';

export default {
    ...baseConfig,
	darkMode: ['selector'],
	content: {
		relative: true,
		files: ['./app/**/*.tsx', '../ui/src/**/*.tsx'],
	},    
};
