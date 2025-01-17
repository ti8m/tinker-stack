import baseConfig from '@repo/eslint-config/react';
import reactCompiler from 'eslint-plugin-react-compiler';

export default [
	...baseConfig,
	{
		files: ['./app/**/*.tsx'],
		plugins: {
			'react-compiler': reactCompiler,
		},
		rules: {
			'react-compiler/react-compiler': 'error',
		},
	},
	{
		languageOptions: {
			parserOptions: {
				tsconfigRootDir: import.meta.dirname,
			},
		},
		// disable some rules for the prototype
		rules: {
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/prefer-nullish-coalescing': 'off',
			'@typescript-eslint/no-base-to-string': 'off',
			'react/no-unknown-property': 'off',
		},
	},
	{
		// Rules for shadcn/ui components
		files: ['**/components/ui/*.tsx'],
		rules: {
			'react/prop-types': 'off',
		},
	},
];
