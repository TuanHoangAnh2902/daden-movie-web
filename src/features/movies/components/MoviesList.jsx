import { useState } from 'react'
import { useGetMoviesListQuery } from '~/services/ophimApi'

const MoviesList = () => {
	const [page, setPage] = useState(1)
	const { data, error, isLoading } = useGetMoviesListQuery(page)

	if (isLoading) return <p>Đang tải phim...</p>
	if (error) return <p>Lỗi khi tải dữ liệu!</p>

	return (
		<div>
			<h2>Danh sách phim mới cập nhật</h2>
			<ul>
				{data?.items?.map((movie) => (
					<li key={movie._id}>
						<img src={movie.thumb_url} alt={movie.name} width='100' />
						<p>{movie.name}</p>
					</li>
				))}
			</ul>
			<button onClick={() => setPage(page - 1)} disabled={page === 1}>
				Trang trước
			</button>
			<button onClick={() => setPage(page + 1)}>Trang sau</button>
			<h1>Con cặc nè heof</h1>
		</div>
	)
}

export default MoviesList
