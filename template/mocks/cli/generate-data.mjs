#! /usr/bin/env node

import { Option, program } from 'commander';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDataset, datasetConfigs } from '../dist/src/index.js';

const __filename = fileURLToPath(import.meta.url);
const defaultOutputFile = path.join(
	path.dirname(__filename),
	'../data-mocks/mocks.<size>.json',
);

const hintOutputFile = path.join(path.dirname(__filename), '../data-mocks/hints.<size>.json');

program
	.name('planning-stack-template-mocks-generator')
	.description('CLI to generate mock data for the PLANNING STACK TEMPLATE Web Project.')
	.option(
		'-o, --output [./path/to/save/file.json]',
		'Path where the generated data should be saved. The <size> placeholder will be replaced by the size of the dataset.',
		defaultOutputFile,
	)
	.addOption(
		new Option('-d, --dataset <size>', 'Dataset to use for the generation of the mock data.')
			.choices(['small', 'medium', 'full'])
			.makeOptionMandatory(),
	)
	// .option('-i, --indexed', 'Generate an indexed dataset.', false)
	.option('-s, --seed <seed>', 'Seed for the random number generator.')
	.parse(process.argv);

const options = program.opts();
const { output, dataset, seed } = options;

const outfile = output.replace('<size>', dataset);

if (!fs.existsSync(path.dirname(outfile))) {
	console.log(
		`\x1b[33m Output folder '${outfile}' does not exist, creating it right now. \u001B[0m`,
	);
	fs.mkdirSync(path.dirname(outfile), {
		recursive: true,
	});
}

const message = `\x1b[33m Generated mock data, writing ${outfile}... \u001B[0m`;

console.time(message);

const config = datasetConfigs[dataset];

if (!config) {
	throw new Error(`Dataset ${dataset} not found`);
}

if (seed) {
	config.seed = seed;
}

const { data } = buildDataset(config);

console.timeEnd(message);

fs.writeFileSync(outfile, JSON.stringify(data, undefined, 2));
