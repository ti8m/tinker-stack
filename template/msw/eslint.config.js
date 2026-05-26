import baseConfig from '@repo/eslint-config/base';

export default [
	...baseConfig,
	{
		languageOptions: {
			parserOptions: {
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			'@typescript-eslint/no-unsafe-enum-comparison': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off'
		},
	},
];
