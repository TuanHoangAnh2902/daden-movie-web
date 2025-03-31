import { useEffect, useState } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { useLazyGetMoviesByListQuery } from '~/services/ophimApi'
import MoviesDisplay from '~/pages/MoviesDisplay/MoviesDisplay'

const MoviesList = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const location = useLocation()

	// Giữ randomColor nếu có
	const randomColor = location.state?.randomColor || ''

	const categoryNameSlug = searchParams.get('name') || ''
	const initialPage = parseInt(searchParams.get('page')) || 1
	const [currentPage, setCurrentPage] = useState(initialPage)

	// API
	const [fetchData, { data, isLoading, isError, error }] = useLazyGetMoviesByListQuery()

	// Đồng bộ `currentPage` với URL
	useEffect(() => {
		setCurrentPage(parseInt(searchParams.get('page')) || 1)
	}, [searchParams])

	// Fetch dữ liệu khi categoryNameSlug hoặc currentPage thay đổi
	useEffect(() => {
		if (!categoryNameSlug) return
		fetchData({ list: categoryNameSlug, page: currentPage })
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}, [categoryNameSlug, currentPage, fetchData])

	// Xử lý chuyển trang
	const handlePageChange = (newPage) => {
		setCurrentPage(newPage)
		setSearchParams({ name: categoryNameSlug, page: newPage.toString() })
	}

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

export default MoviesList
