import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useLazyGetMoviesByListQuery } from '~/services/ophimApi'
import MoviesDisplay from '~/pages/MoviesDisplay/MoviesDisplay'

const MoviesList = () => {
	const { param } = useParams() // Lấy trực tiếp từ URL
	const [searchParams, setSearchParams] = useSearchParams()
	const location = useLocation()

	// Giữ randomColor nếu có
	const randomColor = location.state?.randomColor || ''

	// Lấy page từ query string hoặc mặc định là 1
	const initialPage = parseInt(searchParams.get('page')) || 1
	const [currentPage, setCurrentPage] = useState(initialPage)

	// API
	const [fetchData, { data, isLoading, isError, error }] = useLazyGetMoviesByListQuery()

	// Xử lý chuyển trang
	const handlePageChange = (newPage) => {
		setCurrentPage(newPage)
		setSearchParams({ page: newPage.toString() })
	}

	// Fetch phim khi param hoặc page thay đổi
	useEffect(() => {
		if (!param) return
		fetchData({ list: param, page: currentPage })
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}, [param, currentPage, fetchData])

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

MoviesList.propTypes = {
	titlePage: PropTypes.string,
}

export default MoviesList
