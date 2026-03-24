import { expect, test } from 'vitest';
import { datasetConfigs } from './config.js';
import { buildDataset } from './dataset.js';

test('dataset config presets are available', () => {
  expect(datasetConfigs.small.preset).toBe('small');
  expect(datasetConfigs.medium.preset).toBe('medium');
  expect(datasetConfigs.full.preset).toBe('full');
});

test('starter dataset is empty by default', () => {
  const dataset = buildDataset(datasetConfigs.small);
  expect(dataset.config).toEqual(datasetConfigs.small);
  expect(dataset.data).toEqual({});
  expect(dataset.indexes).toEqual({});
});
