import { expect, test } from 'vitest';
import { datasetConfigs } from './config.js';
import { buildDataset } from './dataset.js';

const smallConfig = datasetConfigs.small;

test('small dataset', () => {
	const { data } = buildDataset(smallConfig);
	expect(data).toBeDefined();
	expect(data.companies).toBeDefined();
	expect(Object.keys(data.companies).length).toBe(smallConfig.companyCount);
	expect(data.persons).toBeDefined();
	expect(Object.keys(data.persons).length).toBe(smallConfig.personCount);
	expect(data.tokens).toBeDefined();
});

test('small dataset is deterministic', () => {
	const { data: dataset1 } = buildDataset(smallConfig);
	buildDataset(smallConfig);
	const { data: dataset2 } = buildDataset(smallConfig);
	expect(dataset1).toEqual(dataset2);
	const { data: dataset3 } = buildDataset({ ...smallConfig, seed: 1234 });
	expect(dataset1).not.toEqual(dataset3);
});
