import baseConfig from '@repo/eslint-config/base';

export default [
	{
		ignores: ['**/node_modules/**', '**/dist/**', '**/.turbo/**'],
	},
	...baseConfig,
	{
		languageOptions: {
			parserOptions: {
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
];
