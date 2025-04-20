/**
 * Memoization utility for optimizing expensive function calls
 * Stores results of function calls based on arguments to avoid recalculation
 */
export function memoize(fn, keyFn, { maxCacheSize = 100 } = {}) {
	const cache = new Map()

	// Generate key from arguments
	const defaultKeyFn = (...args) => {
		if (args.length === 0) return 'default'
		if (args.length === 1) return JSON.stringify(args[0])
		return JSON.stringify(args)
	}

	const generateKey = keyFn || defaultKeyFn

	return function memoized(...args) {
		const key = generateKey(...args)

		if (cache.has(key)) {
			return cache.get(key)
		}

		const result = fn.apply(this, args)

		// Implement LRU (Least Recently Used) cache management
		if (cache.size >= maxCacheSize) {
			const firstKey = cache.keys().next().value
			cache.delete(firstKey)
		}

		cache.set(key, result)
		return result
	}
}

/**
 * Create a debounced and memoized function
 * Useful for expensive calculations triggered by user input
 */
export function debouncedMemo(fn, wait = 300, options = {}) {
	let timeout
	const memoized = memoize(fn, null, options)

	return function (...args) {
		clearTimeout(timeout)
		return new Promise((resolve) => {
			timeout = setTimeout(() => {
				resolve(memoized.apply(this, args))
			}, wait)
		})
	}
}

export default memoize
