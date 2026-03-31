import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, test } from 'vitest';
import { execa } from 'execa';

const CLI_ENTRY = path.resolve('create/index.js');

async function runCommand(cmd, args, options = {}) {
  try {
    return await execa(cmd, args, {
      all: true,
      ...options
    });
  } catch (error) {
    const output = error.all ?? `${error.stdout ?? ''}\n${error.stderr ?? ''}`;
    throw new Error(
      `Command "${cmd} ${args.join(' ')}" failed with exit code ${error.exitCode ?? 'unknown'}\n${output}`
    );
  }
}

describe('create-tinker-stack generator', () => {
  test(
    'scaffolds project with all examples by default and passes build checks',
    async () => {
      const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'tinker-stack-'));
      const appFolder = 'demo-app';
      const projectDir = path.join(tempRoot, appFolder);
      const exampleDir = path.join(projectDir, 'examples', 'react-router');

      try {
        await runCommand('node', [CLI_ENTRY, appFolder], {
          env: {
            ...process.env,
            CI: '1',
            SKIP_SETUP: '1',
            SKIP_FORMAT: '1'
          },
          cwd: tempRoot
        });

        const packageJson = JSON.parse(await readFile(path.join(projectDir, 'package.json'), 'utf8'));
        expect(packageJson.name).toBe('demo-title');
        expect(packageJson).not.toHaveProperty('license');
        expect(packageJson).not.toHaveProperty('author');

        const readme = await readFile(path.join(projectDir, 'README.md'), 'utf8');
        expect(readme).toContain('Demo Title');
        const examplePackageJson = JSON.parse(
          await readFile(path.join(exampleDir, 'package.json'), 'utf8')
        );
        expect(examplePackageJson.scripts).toHaveProperty('build');

        await runCommand('npm', ['install'], { cwd: projectDir });
        await runCommand('npm', ['run', 'typecheck'], { cwd: projectDir });
        await runCommand('npm', ['run', 'build:data'], { cwd: projectDir });
        await runCommand('npm', ['run', 'build'], { cwd: projectDir });
      } finally {
        await rm(tempRoot, { recursive: true, force: true });
      }
    },
    5 * 60 * 1000
  );

  test(
    'scaffolds an independent named example without adding it to the root workspace graph',
    async () => {
      const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'tinker-stack-'));
      const appFolder = 'demo-app';
      const projectDir = path.join(tempRoot, appFolder);
      const exampleDir = path.join(projectDir, 'examples', 'react-router');

      try {
        await runCommand('node', [CLI_ENTRY, '--example', 'react-router', appFolder], {
          env: {
            ...process.env,
            CI: '1',
            SKIP_SETUP: '1',
            SKIP_FORMAT: '1'
          },
          cwd: tempRoot
        });

        const packageJson = JSON.parse(await readFile(path.join(projectDir, 'package.json'), 'utf8'));
        expect(packageJson.name).toBe('demo-title');
        expect(packageJson.workspaces).not.toContain('examples');
        expect(packageJson.workspaces).not.toContain('examples/*');

        const examplePackageJson = JSON.parse(
          await readFile(path.join(exampleDir, 'package.json'), 'utf8')
        );
        expect(examplePackageJson.scripts).toHaveProperty('build');
        expect(examplePackageJson.scripts).toHaveProperty('build:data');

        const exampleReadme = await readFile(path.join(exampleDir, 'README.md'), 'utf8');
        expect(exampleReadme).toContain('self-contained React Router example');
        expect(exampleReadme).toContain('delete the entire example directory');

        await runCommand('npm', ['install'], { cwd: projectDir });
        await runCommand('npm', ['run', 'build'], { cwd: projectDir });
      } finally {
        await rm(tempRoot, { recursive: true, force: true });
      }
    },
    5 * 60 * 1000
  );

  test(
    'skips copying example templates when --no-examples is passed',
    async () => {
      const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'tinker-stack-'));
      const appFolder = 'demo-app';
      const projectDir = path.join(tempRoot, appFolder);

      try {
        await runCommand('node', [CLI_ENTRY, '--no-examples', appFolder], {
          env: {
            ...process.env,
            CI: '1',
            SKIP_SETUP: '1',
            SKIP_FORMAT: '1'
          },
          cwd: tempRoot
        });

        const packageJson = JSON.parse(await readFile(path.join(projectDir, 'package.json'), 'utf8'));
        expect(packageJson.name).toBe('demo-title');
        await expect(readFile(path.join(projectDir, 'examples', 'react-router', 'package.json'), 'utf8'))
          .rejects
          .toMatchObject({ code: 'ENOENT' });
      } finally {
        await rm(tempRoot, { recursive: true, force: true });
      }
    },
    5 * 60 * 1000
  );

  test(
    'scaffolds into the current working directory when no target is provided',
    async () => {
      const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'tinker-stack-'));
      const expectedDir = path.join(tempRoot, 'demo-title');

      try {
        await runCommand('node', [CLI_ENTRY], {
          env: {
            ...process.env,
            CI: '1',
            SKIP_SETUP: '1',
            SKIP_FORMAT: '1'
          },
          cwd: tempRoot
        });

        const packageJson = JSON.parse(await readFile(path.join(expectedDir, 'package.json'), 'utf8'));
        expect(packageJson.name).toBe('demo-title');
      } finally {
        await rm(tempRoot, { recursive: true, force: true });
      }
    },
    5 * 60 * 1000
  );
});
