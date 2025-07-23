import seedrandom from "seedrandom";

/**
 * Shuffle an array deterministically using a seed.
 *
 * @param {Array} array The array to shuffle
 * @param {string|number} seed  A seed value (string or number)
 * @returns {Array} A new shuffled array
 */
export function seededShuffle(array, seed) {
  console.log("seedddddd",array,seed);
  
  const rng = seedrandom(seed.toString());
  const a = array.slice(); // copy
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1)); // 0 ≤ j ≤ i
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
