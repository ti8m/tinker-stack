import baseConfig from '@repo/eslint-config/base';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

/**
 * This config adds additional rules for React and JSX.
 * @returns { import('typescript-eslint').FlatConfig.ConfigArray }
 */
export default tseslint.config(
	...baseConfig,
	{
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	reactPlugin.configs.flat.recommended,
	reactPlugin.configs.flat['jsx-runtime'],
	// enable a11y rules for the frontend and UI only
	// jsxA11yPlugin.flatConfigs.recommended,
	// React
	{
		files: ['**/*.{tsx}'],
		settings: {
			formComponents: ['Form'],
			linkComponents: [
				{ name: 'Link', linkAttribute: 'to' },
				{ name: 'NavLink', linkAttribute: 'to' },
			],
		},
		plugins: {
			'react-hooks': reactHooksPlugin,
		},
		rules: {
			'react/react-in-jsx-scope': 'off',
			...reactHooksPlugin.configs.recommended.rules,
			'react-hooks/rules-of-hooks': 'error',
		},
	},
);
