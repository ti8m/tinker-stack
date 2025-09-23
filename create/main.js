import inquirer from 'inquirer';
import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const getRandomString = length => crypto.randomBytes(length).toString('hex');

export async function main({ rootDirectory }) {
	const EXAMPLE_ENV_PATH = path.join(rootDirectory, '.env.example');
	const ENV_PATH = path.join(rootDirectory, '.env');
	const PKG_PATH = path.join(rootDirectory, 'package.json');

	const appNameRegex = /planning-stack-template/g;
	const appTitleRegex = /PLANNING STACK TEMPLATE/g;

	const DIR_NAME = path.basename(rootDirectory);

	const APP_NAME = DIR_NAME
		// get rid of anything that's not allowed in an app name
		.replace(/[^a-zA-Z0-9-_]/g, '-')
		.toLowerCase();

	const APP_TITLE = await getTitle();

	const [env, packageJsonString] = await Promise.all([
		fs.readFile(EXAMPLE_ENV_PATH, 'utf-8'),
		fs.readFile(PKG_PATH, 'utf-8'),
	]);

	const filesWithAppName = await Promise.all([
		PKG_PATH,
		path.join(rootDirectory, 'remix.init', 'README.md'),
		path.join(rootDirectory, 'docs', 'antora-playbook.yml'),
		path.join(rootDirectory, 'docs', 'antora.yml'),
		path.join(rootDirectory, 'docs', 'modules/ROOT/pages/architecture.adoc'),
		path.join(rootDirectory, 'docs', 'modules/ROOT/pages/documentation.adoc'),
		path.join(rootDirectory, 'docs', 'modules/ROOT/pages/getting-started.adoc'),
		path.join(rootDirectory, 'mock-data', 'cli', 'generate-data.mjs'),
		path.join(rootDirectory, 'prototype', 'README.md'),
		path.join(rootDirectory, 'ui', 'README.md'),
	]);

	const filesWithAppTitle = await Promise.all([
		path.join(rootDirectory, 'remix.init', 'README.md'),
		path.join(rootDirectory, 'docs', 'antora-playbook.yml'),
		path.join(rootDirectory, 'docs', 'antora.yml'),
		path.join(rootDirectory, 'docs', 'modules', 'ROOT', 'pages', 'architecture.adoc'),
		path.join(rootDirectory, 'docs', 'modules', 'ROOT', 'pages', 'index.adoc'),
		path.join(rootDirectory, 'docs', 'modules', 'ROOT', 'pages', 'monorepo.adoc'),
		path.join(rootDirectory, 'docs', 'modules', 'ROOT', 'pages', 'prototype.adoc'),
		path.join(rootDirectory, 'docs', 'modules', 'ROOT', 'partials', 'monorepo.puml'),
		path.join(rootDirectory, 'docs', 'modules', 'ROOT', 'nav.adoc'),
		path.join(rootDirectory, 'docs', 'antora-playbook.yml'),
		path.join(rootDirectory, 'docs', 'package.json'),
		path.join(rootDirectory, 'prototype', 'app', 'root.tsx'),
		path.join(rootDirectory, 'prototype', 'app', 'routes', '_index.tsx'),
		path.join(rootDirectory, 'mock-data', 'cli', 'generate-data.mjs'),
	]);

	// Replace all instances of the app title
	for (const file of filesWithAppTitle) {
		const fileContent = await fs.readFile(file, 'utf-8');
		const newFile = fileContent.replaceAll(appTitleRegex, APP_TITLE);
		await fs.writeFile(file, newFile);
	}
	// Replace all instances of the app name
	for (const file of filesWithAppName) {
		const fileContent = await fs.readFile(file, 'utf-8');
		const newFile = fileContent.replaceAll(appNameRegex, APP_NAME);
		await fs.writeFile(file, newFile);
	}

	const packageJson = JSON.parse(packageJsonString);

	packageJson.name = APP_NAME;
	delete packageJson.author;
	delete packageJson.license;

	const fileOperationPromises = [
		fs.copyFile(EXAMPLE_ENV_PATH, ENV_PATH),
		fs.writeFile(PKG_PATH, JSON.stringify(packageJson, null, 2)),
		fs.rm(path.join(rootDirectory, 'LICENSE.md')),
		fs.copyFile(
			path.join(rootDirectory, 'remix.init', 'gitlab-ci.yml'),
			path.join(rootDirectory, '.gitlab-ci.yml'),
		),
		fs.copyFile(
			path.join(rootDirectory, 'remix.init', 'README.md'),
			path.join(rootDirectory, 'README.md'),
		),
	];

	await Promise.all(fileOperationPromises);

	if (!process.env.SKIP_SETUP) {
		execSync('npm run typecheck', { cwd: rootDirectory, stdio: 'inherit' });
		execSync('npm run build:data', { cwd: rootDirectory, stdio: 'inherit' });
	}

	if (!process.env.SKIP_FORMAT) {
		execSync('npm run format -- --log-level warn', {
			cwd: rootDirectory,
			stdio: 'inherit',
		});
	}

	console.log(
		`
Setup is complete.

What's next?

- Build your mock data
- Build your mock API
- Build your prototype
- Iterate
		`.trim(),
	);
}

async function getTitle() {
	// Check if we are in interactive mode
	if (process.env.CI) {
		return 'Demo Title';
	}

	const { title } = await inquirer.prompt([
		{
			type: 'input',
			name: 'title',
			message: 'Enter the title of the app',
		},
	]);

	return title;
}
