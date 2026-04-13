import { Helmet } from 'react-helmet-async'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

const TRACKING_QUERY_PREFIXES = ['utm_']
const TRACKING_QUERY_KEYS = new Set(['fbclid', 'gclid', 'msclkid', 'ref'])

const sanitizeSearchParams = (search) => {
	if (!search) return ''

	const params = new URLSearchParams(search)
	const filteredParams = new URLSearchParams()

	params.forEach((value, key) => {
		const normalizedKey = key.toLowerCase()
		const isTrackingPrefix = TRACKING_QUERY_PREFIXES.some((prefix) => normalizedKey.startsWith(prefix))

		if (isTrackingPrefix || TRACKING_QUERY_KEYS.has(normalizedKey)) {
			return
		}

		filteredParams.append(key, value)
	})

	const result = filteredParams.toString()
	return result ? `?${result}` : ''
}

const SEO = ({ title, description, image, canonical, noIndex = false }) => {
	const { pathname, search } = useLocation()
	const baseUrl = (import.meta.env.VITE_SITE_URL || 'https://daden-movie-web.vercel.app').replace(/\/$/, '')
	const sanitizedSearch = sanitizeSearchParams(search)

	const seoUrl = canonical || `${baseUrl}${pathname}${sanitizedSearch}`
	const defaultTitle = 'DaDen Movie - Xem phim Vietsub miễn phí'
	const defaultDesc = 'Trang web xem phim chất lượng cao, cập nhật phim mới mỗi ngày.'
	const ogImage = image?.startsWith('http') ? image : `${baseUrl}${image || '/default-thumbnail.jpg'}`

	return (
		<Helmet>
			<title>{title ? `${title} | DaDen Movie` : defaultTitle}</title>
			<meta name='description' content={description || defaultDesc} />
			<meta name='robots' content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
			<link rel='canonical' href={seoUrl} />

			<meta property='og:type' content='website' />
			<meta property='og:title' content={title || defaultTitle} />
			<meta property='og:description' content={description || defaultDesc} />
			<meta property='og:image' content={ogImage} />
			<meta property='og:url' content={seoUrl} />
			<meta name='twitter:card' content='summary_large_image' />
			<meta name='twitter:title' content={title || defaultTitle} />
			<meta name='twitter:description' content={description || defaultDesc} />
			<meta name='twitter:image' content={ogImage} />
		</Helmet>
	)
}

export default SEO

SEO.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	image: PropTypes.string,
	canonical: PropTypes.string,
	noIndex: PropTypes.bool,
}
