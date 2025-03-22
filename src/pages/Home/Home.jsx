import styles from './Home.module.scss'
import classNames from 'classnames/bind'

import CarouselMovies from '~/components/layouts/CarouselMovies/CarouselMovies'
import Collection from '~/components/movie/Collection/Collection'
import Gallery from '~/components/movie/Gallery/Gallery'

const cx = classNames.bind(styles)
function Home() {
	return (
		<div className={cx('home')}>
			<CarouselMovies />
			<Gallery />
			<Collection />
		</div>
	)
}

export default Home
