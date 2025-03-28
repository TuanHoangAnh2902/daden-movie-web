import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useLazyGetMoviesByCountryQuery } from '~/services/ophimApi'
import MoviesDisplay from '~/pages/MoviesDisplay/MoviesDisplay'
const MoviesCountiesList = () => {
	const location = useLocation()
	const param = location.state?.param || ''
	const randomColor = location.state?.randomColor || ''

	const [currentPage, setCurrentPage] = useState(1)
	const [fetchData, { data, isLoading, isError, error }] = useLazyGetMoviesByCountryQuery({
		country: param,
		page: currentPage,
	})

	useEffect(() => {
		if (param) {
			fetchData({ country: param, page: 1 })
			setCurrentPage(1)
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}, [fetchData, param])

	useEffect(() => {
		if (param && currentPage > 1) {
			fetchData({ country: param, page: currentPage })
		}
	}, [currentPage, param, fetchData])

	return (
		<MoviesDisplay
			randomColor={randomColor}
			titlePage={data?.titlePage}
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

MoviesCountiesList.propTypes = {
	titlePage: PropTypes.string,
}

export default MoviesCountiesList
