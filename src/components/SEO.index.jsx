import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const SEO = ({ title, description, image, canonical }) => {
	const { pathname } = useLocation()
	const baseUrl = 'https://daden-movie-web.vercel.app'

	// URL chuẩn SEO tự động nếu không truyền canonical thủ công
	const seoUrl = canonical || `${baseUrl}${pathname}`
	const defaultTitle = 'DaDen Movie - Xem phim Vietsub miễn phí'
	const defaultDesc = 'Trang web xem phim chất lượng cao, cập nhật phim mới mỗi ngày.'

	return (
		<Helmet>
			{/* Các thẻ cơ bản */}
			<title>{title ? `${title} | DaDen Movie` : defaultTitle}</title>
			<meta name='description' content={description || defaultDesc} />
			<link rel='canonical' href={seoUrl} />

			{/* Thẻ Open Graph (Để khi chia sẻ lên Facebook/Zalo sẽ hiện ảnh và mô tả đẹp) */}
			<meta property='og:type' content='website' />
			<meta property='og:title' content={title || defaultTitle} />
			<meta property='og:description' content={description || defaultDesc} />
			<meta property='og:image' content={image || '/default-thumbnail.jpg'} />
			<meta property='og:url' content={seoUrl} />
		</Helmet>
	)
}

export default SEO
