#! /usr/bin/env node

import { main as createMain } from './main.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const cwd = path.dirname(path.dirname(__filename));
const templateDir = path.join(cwd, 'template');

function targetFromArgv() {
  const argv = process.argv.slice(2);
  // prefer a last non-flag positional argument as the target folder
  for (let i = argv.length - 1; i >= 0; i--) {
    if (!argv[i].startsWith('-')) return argv[i];
  }
  return undefined;
}

function normalizeOptions(input = {}) {
  // input may be an options object passed by npm init or undefined
  let opts = {};
  if (typeof input === 'object' && input !== null) opts = input;

  const targetDir =
    opts.targetDirectory ||
    opts.name || // common field name for npm init
    opts.project ||
    targetFromArgv();

  return {
    cwd,
    templateDir: templateDir, // always use the built-in template
    targetDir,
    debug: !!opts.debug,
    install: opts.install ?? true,
    ...opts
  };
}

async function main(...args) {
  const opts = normalizeOptions(args[0]);

  // validate template exists
  try {
    const stat = fs.statSync(templateDir);
    if (!stat.isDirectory()) {
      throw new Error(`Template path is not a directory: ${templateDir}`);
    }
  } catch (err) {
    throw new Error(`Template directory not found: ${templateDir}\n${err.message}`);
  }

  // call the implementation with simple, normalized options
  await createMain(opts);
}

main().catch(console.error.bind(console));