import { useEffect, useMemo, memo } from 'react'
import { Flex, Skeleton } from 'antd'
import styles from './RecommentTab.module.scss'
import classNames from 'classnames/bind'
import { useLazyGetMoviesByCategoryQuery } from '~/services/ophimApi'
import PropTypes from 'prop-types'
import MovieCardWithHover from '~/components/movie/MovieCardWithHover/MovieCardWithHover'
import randomPage from '~/utils/randomPage'

const cx = classNames.bind(styles)

// Memoized movie card skeleton component
const MovieCardSkeleton = memo(() => (
	<div className={cx('movie-card-skeleton')}>
		<Skeleton.Image active className={cx('image-skeleton')} />
		<div className={cx('content-skeleton')}>
			<Skeleton.Input active size='small' style={{ width: '80%', marginBottom: '8px' }} />
			<Skeleton.Input active size='small' style={{ width: '60%' }} />
		</div>
	</div>
))

MovieCardSkeleton.displayName = 'MovieCardSkeleton'

// Generate array of multiple skeletons
const MovieCardsSkeletonList = ({ count = 6 }) => (
	<Flex className={cx('recomment-list')} gap={20} align='start' wrap>
		{[...Array(count)].map((_, index) => (
			<MovieCardSkeleton key={index} />
		))}
	</Flex>
)

function RecommentTab({ movieData }) {
	// Dùng useMemo để tránh tính toán lại mỗi lần re-render
	const randomCategory = useMemo(() => {
		return movieData?.category?.length > 0
			? movieData?.category[Math.floor(Math.random() * movieData?.category.length)]
			: null
	}, [movieData?.category])

	// Memoize the page value to prevent unnecessary recalculations
	const page = useMemo(() => randomPage(), [])

	const [fetchData, { data, isFetching }] = useLazyGetMoviesByCategoryQuery()

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
			{isFetching ? (
				<MovieCardsSkeletonList />
			) : (
				<Flex className={cx('recomment-list')} gap={20} align='start' wrap>
					{movieItems.map((item) => (
						<MovieCardWithHover key={item?._id} imageUrl={cdnImageUrl} movieData={item} direction='vertical' />
					))}
				</Flex>
			)}
		</div>
	)
}

MovieCardsSkeletonList.propTypes = {
	count: PropTypes.number,
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
