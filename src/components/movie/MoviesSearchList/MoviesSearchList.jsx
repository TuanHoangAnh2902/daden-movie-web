import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useLazyGetSearchMovieQuery } from '~/services/ophimApi'
import MoviesDisplay from '~/pages/MoviesDisplay/MoviesDisplay'

const MoviesSearchList = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const query = searchParams.get('query') || '' // Search query from URL
	const location = useLocation()

	const page = parseInt(searchParams.get('page')) || 1 // Page from URL
	const [fetchData, { data = {}, isLoading }] = useLazyGetSearchMovieQuery()
	const [searchResults, setSearchResults] = useState([])

	const { param } = location.state || {} // Get the param from location state
	// Fetch movies when query or page changes
	useEffect(() => {
		if (!query) return // Skip fetch if no query
		fetchData({ slug: query, page })
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}, [query, page, fetchData])

	// Update search results when data changes
	useEffect(() => {
		if (data?.items) {
			setSearchResults(data.items)
		}
	}, [data])

	// Handle page change
	const handlePageChange = (newPage) => {
		setSearchParams({ query, page: newPage.toString() })
	}

	return (
		<MoviesDisplay
			titlePage={`Tìm kiếm: ${param}`}
			imageUrl={data?.APP_DOMAIN_CDN_IMAGE || ''}
			movies={searchResults}
			totalMovies={data?.params?.pagination?.totalItems || 0}
			itemsPerPage={data?.params?.pagination?.totalItemsPerPage || 24}
			isLoading={isLoading}
			currentPage={page}
			setCurrentPage={handlePageChange}
		/>
	)
}

export default MoviesSearchList
