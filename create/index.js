#! /usr/bin/env node

import { main as createMain } from './main.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const packageRoot = path.dirname(path.dirname(__filename));
const templateDir = path.join(packageRoot, 'template');
const exampleTemplatesDir = path.join(packageRoot, 'example-templates');
const DEFAULT_EXAMPLE = 'react-router';

function parseCliArgs(argv = process.argv.slice(2)) {
  const options = {
    cwd: undefined,
    debug: undefined,
    install: undefined,
    examples: [],
    withExample: false
  };
  const positionals = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--example' || arg === '--examples') {
      const value = argv[i + 1];
      if (value && !value.startsWith('-')) {
        options.examples.push(...splitExampleNames(value));
        i += 1;
      }
      continue;
    }

    if (arg.startsWith('--example=')) {
      options.examples.push(...splitExampleNames(arg.slice('--example='.length)));
      continue;
    }

    if (arg.startsWith('--examples=')) {
      options.examples.push(...splitExampleNames(arg.slice('--examples='.length)));
      continue;
    }

    if (arg === '--with-example') {
      options.withExample = true;
      continue;
    }

    if (arg === '--cwd') {
      const value = argv[i + 1];
      if (value && !value.startsWith('-')) {
        options.cwd = value;
        i += 1;
      }
      continue;
    }

    if (arg.startsWith('--cwd=')) {
      options.cwd = arg.slice('--cwd='.length);
      continue;
    }

    if (arg === '--debug') {
      options.debug = true;
      continue;
    }

    if (arg === '--install') {
      options.install = true;
      continue;
    }

    if (arg === '--no-install') {
      options.install = false;
      continue;
    }

    if (!arg.startsWith('-')) {
      positionals.push(arg);
    }
  }

  return {
    ...options,
    positionals
  };
}

function splitExampleNames(value) {
  return value
    .split(',')
    .map(example => example.trim())
    .filter(Boolean);
}

function normalizeExampleNames(value) {
  if (Array.isArray(value)) {
    return value.flatMap(example => normalizeExampleNames(example));
  }

  if (typeof value === 'string') {
    return splitExampleNames(value);
  }

  return [];
}

function normalizeOptions(input = {}) {
  // input may be an options object passed by npm init or undefined
  let opts = {};
  if (typeof input === 'object' && input !== null) opts = input;
  const cli = parseCliArgs();

  const targetDir =
    opts.targetDirectory ||
    opts.name || // common field name for npm init
    opts.project ||
    cli.positionals.at(-1);

  const resolvedCwd =
    typeof (opts.cwd ?? cli.cwd) === 'string' && (opts.cwd ?? cli.cwd).length > 0
      ? path.resolve(process.cwd(), opts.cwd ?? cli.cwd)
      : process.cwd();

  const resolvedTargetDir =
    typeof targetDir === 'string' && targetDir.length > 0
      ? path.resolve(resolvedCwd, targetDir)
      : undefined;

  const examples = [
    ...normalizeExampleNames(opts.examples),
    ...normalizeExampleNames(opts.example),
    ...normalizeExampleNames(cli.examples)
  ];

  if (opts.withExample === true || cli.withExample) {
    examples.push(DEFAULT_EXAMPLE);
  }

  const normalizedExamples = [...new Set(examples)];

  return {
    ...opts,
    targetDir: resolvedTargetDir,
    debug: Boolean(opts.debug ?? cli.debug),
    install: opts.install ?? cli.install ?? true,
    cwd: resolvedCwd,
    templateDir, // always use the built-in template
    exampleTemplatesDir,
    examples: normalizedExamples
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

  if (opts.examples.length > 0) {
    try {
      const stat = fs.statSync(exampleTemplatesDir);
      if (!stat.isDirectory()) {
        throw new Error(`Example templates path is not a directory: ${exampleTemplatesDir}`);
      }
    } catch (err) {
      throw new Error(`Example templates directory not found: ${exampleTemplatesDir}\n${err.message}`);
    }
  }

  // call the implementation with simple, normalized options
  await createMain(opts);
}

main().catch(console.error.bind(console));
