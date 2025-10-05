import inquirer from 'inquirer';
import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const getRandomString = length => crypto.randomBytes(length).toString('hex');

export async function main({ cwd, templateDir, targetDir }) {
  const APP_TITLE = await getTitle();

  const APP_NAME = (APP_TITLE)
    // get rid of anything that's not allowed in an app name
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .toLowerCase();

  // Use targetDir if it is set, otherwise create it from app-name
  targetDir = targetDir ? targetDir : path.join(cwd, APP_NAME);

  console.log({ cwd, templateDir, targetDir, APP_NAME, APP_TITLE });

  await fs.cp(templateDir, targetDir, { recursive: true, force: false, errorOnExist: true }, (err) => {
    console.warn(err);
  });

  const EXAMPLE_ENV_PATH = path.join(targetDir, '.env.example');
	const ENV_PATH = path.join(targetDir, '.env');
	const PKG_PATH = path.join(targetDir, 'package.json');

	const appNameRegex = /planning-stack-template/g;
	const appTitleRegex = /PLANNING STACK TEMPLATE/g;

  const [env, packageJsonString] = await Promise.all([
		fs.readFile(EXAMPLE_ENV_PATH, 'utf-8'),
		fs.readFile(PKG_PATH, 'utf-8'),
	]);

	const filesWithAppName = await Promise.all([
		PKG_PATH,
		path.join(targetDir, 'README.md'),
		path.join(targetDir, 'docs', 'antora-playbook.yml'),
		path.join(targetDir, 'docs', 'antora.yml'),
		path.join(targetDir, 'docs', 'modules/ROOT/pages/architecture.adoc'),
		path.join(targetDir, 'docs', 'modules/ROOT/pages/documentation.adoc'),
		path.join(targetDir, 'docs', 'modules/ROOT/pages/getting-started.adoc'),
		path.join(targetDir, 'mock-data', 'cli', 'generate-data.mjs'),
		path.join(targetDir, 'prototype', 'README.md'),
		path.join(targetDir, 'ui', 'README.md'),
	]);

	const filesWithAppTitle = await Promise.all([
		path.join(targetDir, 'README.md'),
		path.join(targetDir, 'docs', 'antora-playbook.yml'),
		path.join(targetDir, 'docs', 'antora.yml'),
		path.join(targetDir, 'docs', 'modules', 'ROOT', 'pages', 'architecture.adoc'),
		path.join(targetDir, 'docs', 'modules', 'ROOT', 'pages', 'index.adoc'),
		path.join(targetDir, 'docs', 'modules', 'ROOT', 'pages', 'monorepo.adoc'),
		path.join(targetDir, 'docs', 'modules', 'ROOT', 'pages', 'prototype.adoc'),
		path.join(targetDir, 'docs', 'modules', 'ROOT', 'partials', 'monorepo.puml'),
		path.join(targetDir, 'docs', 'modules', 'ROOT', 'nav.adoc'),
		path.join(targetDir, 'docs', 'antora-playbook.yml'),
		path.join(targetDir, 'docs', 'package.json'),
		path.join(targetDir, 'prototype', 'app', 'root.tsx'),
		path.join(targetDir, 'prototype', 'app', 'routes', '_index.tsx'),
		path.join(targetDir, 'mock-data', 'cli', 'generate-data.mjs'),
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
	];

	await Promise.all(fileOperationPromises);

	if (!process.env.SKIP_SETUP) {
		execSync('npm run typecheck', { cwd: targetDir, stdio: 'inherit' });
		execSync('npm run build:data', { cwd: targetDir, stdio: 'inherit' });
	}

	if (!process.env.SKIP_FORMAT) {
		execSync('npm run format -- --log-level warn', {
			cwd: targetDir,
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
