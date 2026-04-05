export const cache = new Map<string, unknown>();

/**
 * Memorized function to cache results of asynchronous operations.
 * This is useful for functions that are called frequently with the same arguments,
 * such as API calls or expensive computations.
 *
 * It does not have any expiration logic, so it will keep the cached results indefinitely. Useful for serverless apps,
 * however.
 *
 * It also can cause memory leaks if used incorrectly, so be careful with the cache size.
 *
 * @param cachePrefix - A prefix for the cache key to avoid collisions.
 * @param func - The asynchronous function to be memorized.
 * @returns A function that returns a cached result if available, or calls the original function.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const asyncMemoized = function <Fn extends (...args: any[]) => any>(cachePrefix: string, func: Fn): Fn {
    // @ts-expect-error - We are using a generic function, so we need to cast it to the correct type.
    return async (...args: Parameters<Fn>): Promise<Awaited<ReturnType<Fn>>> => {
        const key = JSON.stringify([cachePrefix, ...args]);
        const existing = cache.get(key) as ReturnType<Fn> | undefined;
        if (existing) {
            console.debug(`Cache hit for key: ${key}`);
            return existing;
        }

        console.debug(`Cache miss for key: ${key}`);
        try {
            const result = await func(...args);
            cache.set(key, result);
            return result;
        } catch (err) {
            cache.delete(key);
            throw err;
        }
    };
};
