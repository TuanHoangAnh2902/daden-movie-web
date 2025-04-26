import { useEffect, useState } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useLazyGetMoviesByCategoryQuery } from '~/services/ophimApi'
import MoviesDisplay from '~/pages/MoviesDisplay/MoviesDisplay'

const MovieCategoryList = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const location = useLocation()

	const countryNameSlug = searchParams.get('name') // Lấy slug từ query string
	// Lấy page từ query string hoặc mặc định là 1
	const initialPage = parseInt(searchParams.get('page')) || 1
	const [currentPage, setCurrentPage] = useState(initialPage)

	// Giữ randomColor nếu có
	const randomColor = location.state?.randomColor || ''

	// API
	const [fetchData, { data, isLoading, isError, error }] = useLazyGetMoviesByCategoryQuery()

	// Xử lý chuyển trang
	const handlePageChange = (newPage) => {
		setCurrentPage(newPage)
		setSearchParams({ name: countryNameSlug, page: newPage.toString() })
	}

	// Fetch phim khi countryNameSlug hoặc page thay đổi
	useEffect(() => {
		if (!countryNameSlug) return
		fetchData({ category: countryNameSlug, page: currentPage })
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}, [countryNameSlug, currentPage, fetchData])

	return (
		<MoviesDisplay
			randomColor={randomColor}
			titlePage={data?.titlePage || 'Movies List'}
			imageUrl={data?.APP_DOMAIN_CDN_IMAGE}
			movies={data?.items || []}
			totalMovies={data?.params?.pagination?.totalItems || 0}
			itemsPerPage={data?.params?.pagination?.totalItemsPerPage || 20}
			isLoading={isLoading}
			isError={isError}
			error={error}
			currentPage={currentPage}
			setCurrentPage={handlePageChange}
		/>
	)
}

MovieCategoryList.propTypes = {
	titlePage: PropTypes.string,
}

export default MovieCategoryList
