import styles from './Home.module.scss'
import classNames from 'classnames/bind'

import CarouselMovies from '~/components/layouts/CarouselMovies/CarouselMovies'
import Collection from '~/components/movie/Collection/Collection'
import Gallery from '~/components/movie/Gallery/Gallery'
import { useGetMoviesByListQuery } from '~/services/ophimApi'

const cx = classNames.bind(styles)
function Home() {
	const { data: dataPhimLe } = useGetMoviesByListQuery('phim-le')
	const { data: dataSapChieu } = useGetMoviesByListQuery('phim-sap-chieu')

	return (
		<div className={cx('home')}>
			<CarouselMovies />
			<Gallery />
			<Collection movieData={dataPhimLe} direction={'vertical'} reverseDirection={false} />
			<Collection movieData={dataSapChieu} direction={'horizontal'} reverseDirection={true} />
		</div>
	)
}

export default Home
