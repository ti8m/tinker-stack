import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * This is the basic rule set for all projects.
 * Make sure to add the languageOptions.parserOptions.tsconfigRootDir to the project you want to lint.
 * @returns { import('typescript-eslint').FlatConfig.ConfigArray }
 */
export default tseslint.config(
	eslint.configs.recommended,
	importPlugin.flatConfigs.recommended,
	importPlugin.flatConfigs.typescript,
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				projectService: {
					allowDefaultProject: ['*.js'],
					defaultProject: 'tsconfig.json',
				},
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				// ...globals.browser,
				...globals.serviceworker,
			},
		},
		settings: {
			'import/internal-regex': '^#/',
		},
		rules: {
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/consistent-type-definitions': 'off',
			'@typescript-eslint/only-throw-error': 'off',
			'@typescript-eslint/no-duplicate-type-constituents': [
				'error',
				{
					ignoreUnions: true,
					ignoreIntersections: true,
				},
			],
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{ fixStyle: 'separate-type-imports', prefer: 'type-imports' },
			],
			'import/no-unresolved': 'off', // does not properly work with nodenext yet.
			'import/no-relative-packages': 'error',
			'import/no-relative-parent-imports': 'error',
		},
	},
	eslintConfigPrettier,
);
