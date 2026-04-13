import styles from './Home.module.scss'
import classNames from 'classnames/bind'

import CarouselMovies from '~/components/layouts/CarouselMovies/CarouselMovies'
import Collection from '~/components/movie/Collection/Collection'
import Gallery from '~/components/movie/Gallery/Gallery'
import SEO from '~/components/SEO.index'
import { useGetMoviesByListQuery } from '~/services/ophimApi'

const cx = classNames.bind(styles)
function Home() {
	const { data: dataPhimLe, isLoading: isLoadingPhimLe } = useGetMoviesByListQuery({ list: 'phim-le', page: 1 })
	const { data: dataSapChieu, isLoading: isLoadingSapChieu } = useGetMoviesByListQuery({
		list: 'phim-sap-chieu',
		page: 1,
	})

	return (
		<div className={cx('home')}>
			<SEO title='Trang chu' description='Xem phim Vietsub mien phi, cap nhat phim moi moi ngay.' />
			<CarouselMovies autoPlaySpeed={3000} />
			<Gallery />
			<Collection movieData={dataPhimLe} isLoading={isLoadingPhimLe} direction={'vertical'} reverseDirection={false} />
			<Collection
				movieData={dataSapChieu}
				isLoading={isLoadingSapChieu}
				direction={'horizontal'}
				reverseDirection={true}
			/>
		</div>
	)
}

export default Home
