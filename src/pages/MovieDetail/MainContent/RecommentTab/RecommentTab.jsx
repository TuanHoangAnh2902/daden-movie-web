import { Flex } from 'antd'
import styles from './RecommentTab.module.scss'
import classNames from 'classnames/bind'
import { useLazyGetMoviesByCategoryQuery } from '~/services/ophimApi'
import PropTypes from 'prop-types'
import { useEffect, useMemo } from 'react'
import MovieCardWithHover from '~/components/movie/MovieCardWithHover/MovieCardWithHover'
import randomPage from '~/utils/randomPage'

const cx = classNames.bind(styles)
function RecommentTab({ movieData }) {
	// Dùng useMemo để tránh tính toán lại mỗi lần re-render
	const randomCategory = useMemo(() => {
		return movieData?.category?.length > 0
			? movieData?.category[Math.floor(Math.random() * movieData?.category.length)]
			: null
	}, [movieData?.category])

	const page = randomPage()

	const [fetData, { data, isFetching }] = useLazyGetMoviesByCategoryQuery({ category: randomCategory?.slug, page })

	// // Cuộn lên đầu khi đang fetch dữ liệu mới
	// useEffect(() => {
	// 	if (isFetching) {
	// 		window.scrollTo({ top: 0, behavior: 'smooth' })
	// 	}
	// }, [isFetching])

	useEffect(() => {
		if (randomCategory) {
			fetData({ category: randomCategory.slug, page: 1 })
		}
	}, [fetData, randomCategory])

	return (
		<div className={cx('recomment-tab')}>
			<h5 className={cx('title')}>Có thể bạn sẽ thích</h5>
			{isFetching ? (
				<div>loading</div>
			) : (
				<Flex className={cx('recomment-list')} gap={20} align='start' wrap>
					{data?.items?.map((item) => (
						<MovieCardWithHover
							key={item?._id}
							imageUrl={data?.APP_DOMAIN_CDN_IMAGE}
							movieData={item}
							direction='vertical'
						/>
					))}
				</Flex>
			)}
		</div>
	)
}
RecommentTab.propTypes = {
	movieData: PropTypes.shape({
		category: PropTypes.arrayOf(
			PropTypes.shape({
				slug: PropTypes.string.isRequired,
			}),
		),
	}),
}

export default RecommentTab
