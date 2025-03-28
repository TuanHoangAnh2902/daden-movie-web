import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLazyGetSearchMovieQuery } from '~/services/ophimApi'
import MoviesDisplay from '~/pages/MoviesDisplay/MoviesDisplay'

const MoviesSearchList = () => {
	const location = useLocation()
	const param = location.state?.param || ''

	const [fetchMovie, { data, isLoading }] = useLazyGetSearchMovieQuery()

	const [searchResults, setSearchResults] = useState([])

	useEffect(() => {
		if (param) {
			fetchMovie(param)
		}
	}, [param, fetchMovie])

	useEffect(() => {
		if (data) {
			setSearchResults(data.items)
		}
	}, [data])

	return (
		<MoviesDisplay
			titlePage={data?.titlePage}
			imageUrl={data?.APP_DOMAIN_CDN_IMAGE}
			movies={searchResults}
			totalMovies={data?.params?.pagination?.totalItems || 0}
			itemsPerPage={data?.params?.pagination?.totalItemsPerPage || 20}
			isLoading={isLoading}
		/>
	)
}

MoviesSearchList.propTypes = {
	title: PropTypes.string,
}

export default MoviesSearchList
