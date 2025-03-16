import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'

const LazyImage = ({ src, alt }) => {
	const imgRef = useRef(null)
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setLoaded(true)
						observer.disconnect()
					}
				})
			},
			{ threshold: 0.5 },
		)

		if (imgRef.current) observer.observe(imgRef.current)

		return () => observer.disconnect()
	}, [])

	return (
		<img
			ref={imgRef}
			src={loaded ? src : 'placeholder.jpg'}
			alt={alt}
			style={{ transition: 'opacity 0.5s', opacity: loaded ? 1 : 0.5 }}
		/>
	)
}

export default LazyImage

LazyImage.propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
}
