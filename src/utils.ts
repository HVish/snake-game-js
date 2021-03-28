export function windowBounds() {
  const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  return { width, height };
}

/**
 * Generates a random number
 * @param min minimum value (inclusive)
 * @param max maximum value (exclusive)
 * @see https://stackoverflow.com/a/1527820/9709887
 */
export function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * Generates random integer. The value is no lower than
 * min (or the next integer greater than min if min isn't
 * an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * @param min minimum value (inclusive)
 * @param max maximum value (exclusive)
 * @see https://stackoverflow.com/a/1527820/9709887
 */
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
