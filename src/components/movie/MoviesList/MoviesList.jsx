import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import { useLazyGetMoviesByListQuery } from '~/services/ophimApi'
import MoviesDisplay from '~/pages/MoviesDisplay/MoviesDisplay'

const MoviesList = () => {
	const location = useLocation()
	const param = location.state?.param || ''
	const randomColor = location.state?.randomColor || ''

	const [currentPage, setCurrentPage] = useState(1)
	const [fetchData, { data, isLoading, isError, error }] = useLazyGetMoviesByListQuery()

	// Fetch dữ liệu khi `param` hoặc `currentPage` thay đổi
	useEffect(() => {
		if (param) {
			setCurrentPage(1)
			fetchData({ list: param, page: 1 })
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}, [param, fetchData])

	useEffect(() => {
		if (param && currentPage > 1) {
			fetchData({ list: param, page: currentPage })
		}
	}, [currentPage, param, fetchData])

	return (
		<MoviesDisplay
			randomColor={randomColor}
			titlePage={data?.titlePage || 'Danh sách phim'}
			imageUrl={data?.APP_DOMAIN_CDN_IMAGE}
			movies={data?.items || []}
			totalMovies={data?.params?.pagination?.totalItems || 0}
			itemsPerPage={data?.params?.pagination?.totalItemsPerPage || 20}
			isLoading={isLoading}
			isError={isError}
			error={error}
			currentPage={currentPage}
			setCurrentPage={setCurrentPage}
		/>
	)
}

MoviesList.propTypes = {
	titlePage: PropTypes.string,
}

export default MoviesList
