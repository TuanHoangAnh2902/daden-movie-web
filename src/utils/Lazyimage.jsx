import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'

const LazyImage = ({
	src,
	alt,
	placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=',
	className = '',
	style = {},
	loadingStrategy = 'lazy', // Add native loading strategy option
}) => {
	const imgRef = useRef(null)
	const [loaded, setLoaded] = useState(false)
	const [isInView, setIsInView] = useState(false)
	const [currentSrc, setCurrentSrc] = useState(placeholderSrc)

	// Handle intersection observer to detect when image is in viewport
	useEffect(() => {
		// Skip intersection observer if using native lazy loading
		if (loadingStrategy === 'eager') {
			setIsInView(true)
			return
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsInView(true)
						observer.disconnect()
					}
				})
			},
			{ threshold: 0.1, rootMargin: '200px' }, // Increased margin for better pre-loading
		)

		if (imgRef.current) observer.observe(imgRef.current)

		return () => {
			if (observer) {
				observer.disconnect()
			}
		}
	}, [loadingStrategy])

	// Handle image onload event
	const onImageLoad = () => {
		setLoaded(true)
	}

	// Update current src when in view
	useEffect(() => {
		if (isInView && src) {
			setCurrentSrc(src)
		}
	}, [isInView, src])

	return (
		<img
			ref={imgRef}
			src={currentSrc}
			alt={alt}
			className={className}
			loading={loadingStrategy} // Use native loading attribute
			onLoad={onImageLoad}
			style={{
				transition: 'opacity 0.3s',
				opacity: loaded || currentSrc === placeholderSrc ? 1 : 0.5,
				...style,
			}}
		/>
	)
}

export default LazyImage

LazyImage.propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
	placeholderSrc: PropTypes.string,
	className: PropTypes.string,
	style: PropTypes.object,
	loadingStrategy: PropTypes.oneOf(['lazy', 'eager']),
}
