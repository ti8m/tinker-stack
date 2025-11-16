import baseConfig from '@repo/eslint-config/react';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

export default [
	...baseConfig,
	jsxA11yPlugin.flatConfigs.recommended,
	{
		languageOptions: {
			parserOptions: {
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		// Rules for shadcn/ui components
		files: ['**/ui/*.tsx'],
		rules: {
			'react/prop-types': 'off',
		},
	},
];
