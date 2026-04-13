import { useEffect, useState } from 'react'
import { useSearchParams, useLocation, useParams } from 'react-router-dom'
import SEO from '~/components/SEO.index'
import { useLazyGetMoviesByListQuery } from '~/services/ophimApi'
import MoviesDisplay from '~/pages/MoviesDisplay/MoviesDisplay'

const MoviesList = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const location = useLocation()
	const { listSlug = '' } = useParams()

	// Giữ randomColor nếu có
	const randomColor = location.state?.randomColor || ''

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
		if (!listSlug) return
		fetchData({ list: listSlug, page: currentPage })
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}, [listSlug, currentPage, fetchData])

	// Xử lý chuyển trang
	const handlePageChange = (newPage) => {
		setCurrentPage(newPage)
		setSearchParams({ page: newPage.toString() })
	}

	return (
		<>
			<SEO title={data?.titlePage || 'Danh sach phim'} description={`Danh sach phim ${data?.titlePage || ''}`.trim()} />
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
		</>
	)
}

export default MoviesList
