import type { Randomizer } from '@faker-js/faker';

type ConfigBase = {
	/**
	 * Optional randomizer to use for generating the dataset.
	 */
	randomizer?: Randomizer;
	companyCount: number;
	/**
	 * Number of persons to generate.
	 */
	personCount: number;
};

type ConfigWithSeed = {
	/**
	 * The seed for the random number generator.
	 */
	seed: number;
	/**
	 * The reference date for the dataset.
	 */
	refDate: Date;
} & ConfigBase;

type ConfigWithoutSeed = {
	randomizer?: Randomizer;
	seed?: never;
	refDate?: never;
} & ConfigBase;

export type DatasetConfig = ConfigWithSeed | ConfigWithoutSeed;

export const datasetConfigs = {
	small: {
		seed: 1,
		refDate: new Date('2024-09-11T00:00:00.000Z'),
		companyCount: 2,
		personCount: 3,
	},
	medium: {
		seed: 1,
		refDate: new Date('2024-09-11T00:00:00.000Z'),
		companyCount: 2,
		personCount: 50,
	},
	full: {
		seed: 1,
		refDate: new Date('2024-09-11T00:00:00.000Z'),
		companyCount: 300,
		personCount: 10000,
	},
} satisfies Record<string, DatasetConfig>;

export type DatasetPreset = keyof typeof datasetConfigs;
