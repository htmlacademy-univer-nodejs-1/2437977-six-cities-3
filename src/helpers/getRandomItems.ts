import {generateRandomValue} from './generateRandomValue.js';

export function getRandomItems<T>(items: T[]): T[] {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(startPosition, items.length - 1);
  return items.slice(startPosition, endPosition);
}
