import MovieInfo from '~/features/movies/components/MovieInfo'
import MoviesList from '~/features/movies/components/MoviesList'

function Home() {
	return (
		<>
			<MoviesList />
			<MovieInfo />
		</>
	)
}

export default Home
