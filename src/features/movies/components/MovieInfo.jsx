import { useGetMovieInfoQuery } from '~/services/ophimApi'

function MovieInfo() {
	const { data, error, isLoading } = useGetMovieInfoQuery('ngoi-truong-xac-song')

	if (isLoading) return <p>Đang tải phim...</p>
	if (error) return <p>Lỗi khi tải dữ liệu!</p>

	console.log('🚀 ~ MovieInfo ~ data:', data.movie)
	console.log('🚀 ~ MovieInfo ~ isLoading:', isLoading)
	console.log('🚀 ~ MovieInfo ~ error:', error)

	return <div>MovieInfo</div>
}

export default MovieInfo
