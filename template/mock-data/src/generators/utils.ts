import type { Randomizer } from '@faker-js/faker';
import { base, de, de_CH, Faker, mergeLocales } from '@faker-js/faker';

export function invariant(condition: any, message: string): asserts condition {
	if (!condition) {
		throw new Error(message);
	}
}

export interface MultilingualFakerOptions {
	/**
	 * The randomizer to use for generating the dataset.
	 */
	randomizer: Randomizer;

	/**
	 * The reference date for the dataset.
	 */
	refDate?: Date;
}

/**
 * This is a simplified version of the multilingual faker.
 * It only supports one locale.
 */
export function createFaker(options: MultilingualFakerOptions): Faker {
	const { randomizer, refDate = new Date() } = options;
	const locale = mergeLocales([de_CH, de, base]);

	const faker = new Faker({
		locale,
		randomizer,
	});

	faker.setDefaultRefDate(refDate);

	return faker;
}

/**
 * Creates an unclosed IterableIterator from an IterableIterator.
 * Useful to iterate over an IterableIterator multiple times, especially infinite ones.
 */
export function unclosed<T>(iterable: IterableIterator<T>): IterableIterator<T> {
	return {
		next: () => iterable.next(),
		[Symbol.iterator]() {
			return this;
		},
	};
}

export function first<T>(iterable: Iterable<T>): T | undefined {
	for (const item of iterable) {
		return item;
	}
}

export function* take<T>(iterable: Iterable<T>, count: number): Generator<T> {
	if (count <= 0) {
		return;
	}

	for (const item of iterable) {
		yield item;

		if (--count <= 0) {
			break;
		}
	}
}

export function* zip<T, U>(iterable1: Iterable<T>, iterable2: Iterable<U>): Generator<[T, U]> {
	const iterator1 = iterable1[Symbol.iterator]();
	const iterator2 = iterable2[Symbol.iterator]();

	while (true) {
		const result1 = iterator1.next();
		const result2 = iterator2.next();

		if (result1.done || result2.done) {
			break;
		}

		yield [result1.value, result2.value];
	}
}

export class CheckedMap<K extends string, V> extends Map<K, V> {
	get(key: K): V {
		invariant(super.has(key), `Key not found: ${key}`);
		return super.get(key)!;
	}
}
