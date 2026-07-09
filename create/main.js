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

  // npm strips `.gitignore` from published packages, so the template ships it as
  // `gitignore`. Restore the dotfile name in the generated project.
  await restoreGitignore(targetDir);

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

      const exampleTargetDir = path.join(examplesDir, example);

      // Copy from templateDir (not targetDir) to avoid a circular-copy error —
      // Node rejects copying a directory into its own subdirectory at the path-check
      // level, before any filter function is called.
      await fs.cp(templateDir, exampleTargetDir, {
        recursive: true,
        force: false,
        errorOnExist: true,
      });

      await restoreGitignore(exampleTargetDir);

      // Apply the same token replacements as for the main project, remapped to exampleTargetDir.
      const remap = (f) => path.join(exampleTargetDir, path.relative(targetDir, f));
      await replaceTokensInFiles(filesWithAppTitle.map(remap), appTitleRegex, APP_TITLE);
      await replaceTokensInFiles(filesWithAppName.map(remap), appNameRegex, APP_NAME);

      // Mirror the package.json cleanup and .env setup.
      const exPkgPath = path.join(exampleTargetDir, 'package.json');
      const exPkg = JSON.parse(await fs.readFile(exPkgPath, 'utf-8'));
      exPkg.name = APP_NAME;
      delete exPkg.author;
      delete exPkg.license;
      await Promise.all([
        fs.copyFile(path.join(exampleTargetDir, '.env.example'), path.join(exampleTargetDir, '.env')),
        fs.writeFile(exPkgPath, JSON.stringify(exPkg, null, 2)),
      ]);

      // Overlay example-specific files on top.
      await mergeExampleFiles(sourceDir, exampleTargetDir);
    }
  }

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

async function restoreGitignore(dir) {
  const shipped = path.join(dir, 'gitignore');
  const dotfile = path.join(dir, '.gitignore');
  try {
    await fs.rename(shipped, dotfile);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

async function mergeExampleFiles(sourceDir, targetDir) {
  const entries = await fs.readdir(sourceDir, { recursive: true, withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const relativePath = path.relative(sourceDir, path.join(entry.parentPath, entry.name));
    const sourcePath = path.join(sourceDir, relativePath);
    const targetPath = path.join(targetDir, relativePath);

    if (relativePath.endsWith('.json')) {
      const base = JSON.parse(await fs.readFile(targetPath, 'utf-8'));
      const delta = JSON.parse(await fs.readFile(sourcePath, 'utf-8'));
      await fs.writeFile(targetPath, JSON.stringify(deepMerge(base, delta), null, 2));
    } else {
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}

function deepMerge(base, override) {
  const result = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      result[key] !== null &&
      typeof result[key] === 'object' &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key], value);
    } else {
      result[key] = value;
    }
  }
  return result;
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
