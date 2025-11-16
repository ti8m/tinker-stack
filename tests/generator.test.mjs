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
    'scaffolds project and passes build checks',
    async () => {
      const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'tinker-stack-'));
      const projectDir = path.join(tempRoot, 'demo-app');

      try {
        await runCommand('node', [CLI_ENTRY, projectDir], {
          env: {
            ...process.env,
            CI: '1',
            SKIP_SETUP: '1',
            SKIP_FORMAT: '1'
          }
        });

        const packageJson = JSON.parse(await readFile(path.join(projectDir, 'package.json'), 'utf8'));
        expect(packageJson.name).toBe('demo-title');
        expect(packageJson).not.toHaveProperty('license');
        expect(packageJson).not.toHaveProperty('author');

        const readme = await readFile(path.join(projectDir, 'README.md'), 'utf8');
        expect(readme).toContain('Demo Title');

        await runCommand('npm', ['install'], { cwd: projectDir });
        await runCommand('npm', ['run', 'typecheck'], { cwd: projectDir });
        await runCommand('npm', ['run', 'build:data'], { cwd: projectDir });
        await runCommand('npm', ['run', 'build'], { cwd: projectDir });
      } finally {
        await rm(tempRoot, { recursive: true, force: true });
      }
    },
    10 * 60 * 1000
  );
});
