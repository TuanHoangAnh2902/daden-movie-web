import { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import styles from './RecommentMovie.module.scss'
import classNames from 'classnames/bind'
import randomPage from '~/utils/randomPage'
import { useLazyGetMoviesByCategoryQuery } from '~/services/ophimApi'
import { Flex } from 'antd'
import { LuDot } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'

const cx = classNames.bind(styles)
function RecommentMovie({ movieData }) {
	const navigate = useNavigate()
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
	const cdnImageUrl = useMemo(
		() => (data?.APP_DOMAIN_CDN_IMAGE ? `${data.APP_DOMAIN_CDN_IMAGE}/uploads/movies/` : ''),
		[data?.APP_DOMAIN_CDN_IMAGE],
	)

	const handleMovieClick = (movieId) => {
		navigate(`/movie/detail?id=${movieId}`)
	}
	return (
		<div className={cx('recomment-movie')}>
			<h5 className={cx('title')}>Đề xuất cho bạn</h5>
			{!isFetching && (
				<Flex className={cx('recomment-list')} vertical gap={14}>
					{movieItems.map((item) => (
						<Flex key={item?._id} className={cx('movie-card')}>
							<div className={cx('card-img')} onClick={() => handleMovieClick(item?._id)}>
								<img src={cdnImageUrl + item?.thumb_url} alt='' />
							</div>
							<Flex vertical className={cx('card-content')} justify='center' gap={10}>
								<p className={cx('card-name')} onClick={() => handleMovieClick(item?._id)}>
									{item?.name}
								</p>
								<p className={cx('card-origin-name')}>{item?.origin_name}</p>
								<Flex className={cx('card-info')} gap={4} align='center'>
									<p>{item.time}</p>
									{item.year && <LuDot className={cx('dot')} />}
									<p>{item.year}</p>
									{item.lang && <LuDot className={cx('dot')} />}
									<p>{item.lang}</p>
								</Flex>
							</Flex>
						</Flex>
					))}
				</Flex>
			)}
		</div>
	)
}
RecommentMovie.propTypes = {
	movieData: PropTypes.shape({
		category: PropTypes.arrayOf(
			PropTypes.shape({
				slug: PropTypes.string.isRequired,
			}),
		),
		episode_total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		time: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		status: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	}),
}

export default RecommentMovie
