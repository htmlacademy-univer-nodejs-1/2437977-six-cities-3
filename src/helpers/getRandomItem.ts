import {generateRandomValue} from './generateRandomValue.js';

export function getRandomItem<T>(items: T[]): T {
  return items[generateRandomValue(0, items.length - 1)];
}
