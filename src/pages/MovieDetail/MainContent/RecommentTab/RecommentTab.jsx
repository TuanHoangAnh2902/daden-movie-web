import { useEffect, useMemo, memo } from 'react'
import { Flex } from 'antd'
import styles from './RecommentTab.module.scss'
import classNames from 'classnames/bind'
import { useLazyGetMoviesByCategoryQuery } from '~/services/ophimApi'
import PropTypes from 'prop-types'
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

	// Memoize the page value to prevent unnecessary recalculations
	const page = useMemo(() => randomPage(), [])

	const [fetchData, { data }] = useLazyGetMoviesByCategoryQuery()

	useEffect(() => {
		if (randomCategory) {
			// Use the memoized page value
			fetchData({ category: randomCategory.slug, page })
		}
	}, [fetchData, randomCategory, page])

	// Memoize the movies data to prevent unnecessary re-renders
	const movieItems = useMemo(() => data?.items || [], [data?.items])
	const cdnImageUrl = useMemo(() => data?.APP_DOMAIN_CDN_IMAGE || '', [data?.APP_DOMAIN_CDN_IMAGE])

	return (
		<div className={cx('recomment-tab')}>
			<h5 className={cx('title')}>Có thể bạn sẽ thích</h5>
			<Flex className={cx('recomment-list')} gap={20} align='start' wrap>
				{movieItems.map((item) => (
					<MovieCardWithHover key={item?._id} imageUrl={cdnImageUrl} movieData={item} direction='vertical' />
				))}
			</Flex>
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

export default memo(RecommentTab)
