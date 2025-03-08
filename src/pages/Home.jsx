import MovieSearch from '~/components/movie/movieSearch'
import MoviesList from '~/components/movie/MoviesList'

function Home() {
	return (
		<div style={{ minHeight: '100vh' }}>
			<MoviesList />
			<MovieSearch />
		</div>
	)
}

export default Home
