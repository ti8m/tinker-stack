/** @type {import("prettier").Options} */
export default {
	arrowParens: 'avoid',
	bracketSameLine: false,
	bracketSpacing: true,
	embeddedLanguageFormatting: 'auto',
	endOfLine: 'lf',
	htmlWhitespaceSensitivity: 'css',
	insertPragma: false,
	jsxSingleQuote: false,
	printWidth: 100,
	proseWrap: 'always',
	quoteProps: 'consistent',
	requirePragma: false,
	semi: true,
	singleAttributePerLine: false,
	singleQuote: true,
	tabWidth: 2,
	trailingComma: 'all',
	useTabs: true,
	overrides: [
		{
			files: ['**/*.json', '**/*.yaml', '**/*.yml', '/**/*.adoc', '**/*.md'],
			options: {
				useTabs: false,
			},
		},
	],
	plugins: ['prettier-plugin-organize-imports'],
};
