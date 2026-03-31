import inquirer from 'inquirer';
import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function main({ cwd, templateDir, exampleTemplatesDir, targetDir, examples = [], title }) {
  const APP_TITLE = await getTitle(title);

  const APP_NAME = (APP_TITLE)
    // get rid of anything that's not allowed in an app name
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .toLowerCase();

  // Use targetDir if it is set, otherwise create it from app-name
  targetDir = targetDir ? targetDir : path.join(cwd, APP_NAME);

  console.log({ cwd, templateDir, targetDir, APP_NAME, APP_TITLE });

  await fs.cp(templateDir, targetDir, {
    recursive: true,
    force: false,
    errorOnExist: true,
  });

  if (examples.length > 0) {
    const examplesDir = path.join(targetDir, 'examples');
    await fs.mkdir(examplesDir, { recursive: true });

    for (const example of examples) {
      const sourceDir = path.join(exampleTemplatesDir, example);

      try {
        const stat = await fs.stat(sourceDir);
        if (!stat.isDirectory()) {
          throw new Error(`Example template path is not a directory: ${sourceDir}`);
        }
      } catch (error) {
        throw new Error(`Unknown example template "${example}"`);
      }

      await fs.cp(sourceDir, path.join(examplesDir, example), {
        recursive: true,
        force: false,
        errorOnExist: true,
      });
    }
  }

  const EXAMPLE_ENV_PATH = path.join(targetDir, '.env.example');
  const ENV_PATH = path.join(targetDir, '.env');
  const PKG_PATH = path.join(targetDir, 'package.json');

  const appNameRegex = /planning-stack-template/g;
  const appTitleRegex = /PLANNING STACK TEMPLATE/g;

  const packageJsonString = await fs.readFile(PKG_PATH, 'utf-8');

  const filesWithAppName = [
    PKG_PATH,
    path.join(targetDir, 'README.md'),
    path.join(targetDir, 'docs', 'antora-playbook.yml'),
    path.join(targetDir, 'docs', 'antora.yml'),
    path.join(targetDir, 'docs', 'modules/ROOT/pages/architecture.adoc'),
    path.join(targetDir, 'docs', 'modules/ROOT/pages/documentation.adoc'),
    path.join(targetDir, 'docs', 'modules/ROOT/pages/getting-started.adoc'),
    path.join(targetDir, 'prototype', 'README.md'),
    path.join(targetDir, 'ui', 'README.md'),
  ];

  const filesWithAppTitle = [
    path.join(targetDir, 'README.md'),
    path.join(targetDir, 'docs', 'antora-playbook.yml'),
    path.join(targetDir, 'docs', 'antora.yml'),
    path.join(targetDir, 'docs', 'modules', 'ROOT', 'pages', 'architecture.adoc'),
    path.join(targetDir, 'docs', 'modules', 'ROOT', 'pages', 'index.adoc'),
    path.join(targetDir, 'docs', 'modules', 'ROOT', 'pages', 'monorepo.adoc'),
    path.join(targetDir, 'docs', 'modules', 'ROOT', 'pages', 'prototype.adoc'),
    path.join(targetDir, 'docs', 'modules', 'ROOT', 'partials', 'monorepo.puml'),
    path.join(targetDir, 'docs', 'modules', 'ROOT', 'nav.adoc'),
    path.join(targetDir, 'docs', 'package.json'),
    path.join(targetDir, 'prototype', 'app', 'root.tsx'),
    path.join(targetDir, 'prototype', 'app', 'routes', '_index.tsx'),
    path.join(targetDir, 'prototype', 'README.md'),
  ];

  await replaceTokensInFiles(filesWithAppTitle, appTitleRegex, APP_TITLE);
  await replaceTokensInFiles(filesWithAppName, appNameRegex, APP_NAME);

  const packageJson = JSON.parse(packageJsonString);

  packageJson.name = APP_NAME;
  delete packageJson.author;
  delete packageJson.license;

  await Promise.all([
    fs.copyFile(EXAMPLE_ENV_PATH, ENV_PATH),
    fs.writeFile(PKG_PATH, JSON.stringify(packageJson, null, 2)),
  ]);

  if (!process.env.SKIP_SETUP) {
    execSync('npm install', { cwd: targetDir, stdio: 'inherit' });
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

async function replaceTokensInFiles(files, pattern, replacement) {
  for (const file of files) {
    try {
      const fileContent = await fs.readFile(file, 'utf-8');
      await fs.writeFile(file, fileContent.replaceAll(pattern, replacement));
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}

async function getTitle(providedTitle) {
  if (typeof providedTitle === 'string' && providedTitle.trim().length > 0) {
    return providedTitle.trim();
  }

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
