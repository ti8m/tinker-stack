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
		execSync('npm install', { cwd: targetDir, stdio: 'inherit' });
		await pinDependencies(targetDir);
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

async function pinDependencies(targetDir) {
	const pinPackage = async (dir, isRoot = false) => {
		const pkgPath = path.join(dir, 'package.json');
		let pkg;
		try {
			pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));
		} catch (e) {
			return null;
		}

		let installedDeps = {};
		try {
			const output = execSync('npm list --json --depth=0', {
				cwd: dir,
				encoding: 'utf-8',
				stdio: ['ignore', 'pipe', 'ignore'],
			});
			const parsed = JSON.parse(output);
			installedDeps = parsed.dependencies || {};
			// In workspaces, npm list often returns the root dependencies with the workspace nested
			if (pkg.name && installedDeps[pkg.name] && installedDeps[pkg.name].dependencies) {
				installedDeps = installedDeps[pkg.name].dependencies;
			}
		} catch (e) {
			if (e.stdout) {
				const parsed = JSON.parse(e.stdout.toString());
				installedDeps = parsed.dependencies || {};
				if (pkg.name && installedDeps[pkg.name] && installedDeps[pkg.name].dependencies) {
					installedDeps = installedDeps[pkg.name].dependencies;
				}
			}
		}

		const updateDeps = (depsObj) => {
			if (!depsObj) return;
			for (const dep of Object.keys(depsObj)) {
				if (depsObj[dep] === '*') continue;
				if (installedDeps[dep] && installedDeps[dep].version) {
					depsObj[dep] = installedDeps[dep].version;
				}
			}
		};

		updateDeps(pkg.dependencies);
		updateDeps(pkg.devDependencies);

		if (isRoot && pkg.resolutions) {
			for (const dep of Object.keys(pkg.resolutions)) {
				if (pkg.resolutions[dep] === '*' || !installedDeps[dep]) continue;
				if (installedDeps[dep].version) {
					pkg.resolutions[dep] = installedDeps[dep].version;
				}
			}
		}

		await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2));
		return pkg;
	};

	const rootPkg = await pinPackage(targetDir, true);

	if (rootPkg && Array.isArray(rootPkg.workspaces)) {
		for (const workspace of rootPkg.workspaces) {
			// Handle basic glob patterns (ends with /*)
			if (workspace.endsWith('/*')) {
				const parentDir = path.join(targetDir, workspace.slice(0, -2));
				try {
					const subdirs = await fs.readdir(parentDir, { withFileTypes: true });
					for (const dirent of subdirs) {
						if (dirent.isDirectory()) {
							await pinPackage(path.join(parentDir, dirent.name));
						}
					}
				} catch (e) {
					// Ignore if directory doesn't exist
				}
			} else {
				await pinPackage(path.join(targetDir, workspace));
			}
		}
	}
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
