// Tạo một debounced function để hạn chế tần suất gọi function
export function debounce(func, wait = 300, options = {}) {
	let timeoutId = null
	const { leading = false, trailing = true } = options

	return function (...args) {
		const context = this
		const invokeLeading = leading && !timeoutId

		const later = () => {
			timeoutId = null
			if (trailing) func.apply(context, args)
		}

		clearTimeout(timeoutId)
		timeoutId = setTimeout(later, wait)

		if (invokeLeading) func.apply(context, args)
	}
}
