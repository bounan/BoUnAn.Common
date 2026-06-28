/**
 * Splits an array into chunks of a specified size.
 * @param array The array to split.
 * @param chunkSize The size of each chunk.
 * @returns An array of chunks.
 */
export const splitToChunks = <T>(array: T[], chunkSize: number): T[][] =>
  Array.from(
    { length: Math.ceil(array.length / chunkSize) },
    (_, i) => array.slice(i * chunkSize, (i + 1) * chunkSize),
  );