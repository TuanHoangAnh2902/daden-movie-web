import { memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import useImageLoader from '~/hooks/useImageLoader'

// Placeholder image URL
const DEFAULT_PLACEHOLDER =
	'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMyODJiM2EiLz48L3N2Zz4='

const LazyImage = memo(
	({
		src,
		alt = '',
		placeholderSrc = DEFAULT_PLACEHOLDER,
		style = {},
		className = '',
		imgProps = {},
		threshold = 0.1,
		rootMargin = '100px',
		effect = 'opacity',
		onLoad,
		onError,
		...props
	}) => {
		const { isLoading, error, imageSrc, ref } = useImageLoader(src, placeholderSrc, {
			threshold,
			rootMargin,
			useIntersectionObserver: true,
		})

		// Style for fade-in effect
		const imageStyle = {
			...style,
			transition: effect === 'opacity' ? 'opacity 0.5s ease-in-out' : 'none',
			opacity: isLoading ? 0.5 : 1,
		}

		// Custom onLoad handler
		const handleLoad = useCallback(
			(e) => {
				if (onLoad) onLoad(e)
			},
			[onLoad],
		)

		// Custom onError handler combining component error and passed handler
		const handleError = useCallback(
			(e) => {
				if (error) console.warn(`Lỗi tải hình ảnh: ${src}`, error)

				// Nếu có fallback error handler được truyền vào, thực thi nó
				if (onError) onError(e)
				else if (e.target) {
					// Default fallback
					e.target.onerror = null // Tránh vòng lặp vô hạn
					e.target.src = 'https://placehold.co/1280x720/png?text=Image+Not+Available'
				}
			},
			[error, src, onError],
		)

		return (
			<img
				ref={ref}
				src={imageSrc}
				alt={alt}
				className={className}
				style={imageStyle}
				loading='lazy'
				onLoad={handleLoad}
				onError={handleError}
				{...imgProps}
				{...props}
			/>
		)
	},
)

LazyImage.propTypes = {
	src: PropTypes.string,
	alt: PropTypes.string,
	placeholderSrc: PropTypes.string,
	style: PropTypes.object,
	className: PropTypes.string,
	imgProps: PropTypes.object,
	threshold: PropTypes.number,
	rootMargin: PropTypes.string,
	effect: PropTypes.string,
	onLoad: PropTypes.func,
	onError: PropTypes.func,
}

LazyImage.displayName = 'LazyImage'

export default LazyImage
