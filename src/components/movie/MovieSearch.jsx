import { useState } from 'react'
import { Input, Button, Card } from 'antd'
import { useLazyGetMovieInfoQuery } from '~/services/ophimApi'

const MovieSearch = () => {
	const [slug, setSlug] = useState('')
	const [fetchMovie, { data, error, isLoading }] = useLazyGetMovieInfoQuery() // 🟢 useLazyQuery
	console.log('🚀 ~ MovieSearch ~ data:', data)

	const handleSearch = () => {
		if (slug) {
			fetchMovie(slug) // 🟢 Gọi API khi người dùng nhấn nút
		}
	}

	return (
		<div style={{ maxWidth: 400, margin: '20px auto', textAlign: 'center' }}>
			<Input
				placeholder='Nhập slug phim (vd: nguoi-nhen)'
				value={slug}
				onChange={(e) => setSlug(e.target.value)}
				style={{ marginBottom: 10 }}
			/>
			<Button type='primary' onClick={handleSearch}>
				Tìm phim
			</Button>

			{isLoading && <p>Đang tải...</p>}
			{error && <p style={{ color: 'red' }}>Không tìm thấy phim!</p>}

			{data && (
				<Card title={data.movie?.title} style={{ marginTop: 20 }}>
					<p>{data.movie?.description}</p>
					<img src={data.movie?.thumb_url} alt={data.movie?.title} style={{ width: '100%', borderRadius: 10 }} />
				</Card>
			)}
		</div>
	)
}

export default MovieSearch
