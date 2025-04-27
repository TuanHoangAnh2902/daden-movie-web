import Typography from 'antd/es/typography/Typography'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import { memo, useMemo } from 'react'
import CategoryInfo from '~/components/common/CategoriesInfo/CategoryInfo'
import removeTagsUsingDOM from '~/utils/removeTagsUsingDOM'
import styles from '../CarouselMovies.module.scss'
import MovieInfo from './MovieInfo'
import PlayButton from './PlayButton'

const cx = classNames.bind(styles)

const CarouselItem = ({ movie }) => {
	const description = useMemo(() => removeTagsUsingDOM(movie?.content), [movie?.content])

	return (
		<div className={cx('carousel-content')}>
			<Typography.Title level={4} className={cx('carousel-title')}>
				{movie?.name}
			</Typography.Title>
			<MovieInfo episode_current={movie.episode_current} episode_total={movie.episode_total} year={movie.year} />
			<CategoryInfo categoryData={movie?.category} carousel={true} />
			<Typography.Paragraph ellipsis={{ rows: 3 }} className={cx('carousel-description')}>
				{description}
			</Typography.Paragraph>
			<PlayButton movieId={movie?._id} type={movie?.type} />
		</div>
	)
}

CarouselItem.propTypes = {
	movie: PropTypes.shape({
		_id: PropTypes.string,
		name: PropTypes.string,
		content: PropTypes.string,
		type: PropTypes.string,
		episode_current: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		episode_total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		category: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
				name: PropTypes.string,
			}),
		),
		poster_url: PropTypes.string,
	}).isRequired,
}

CarouselItem.displayName = 'CarouselItem'

export default memo(CarouselItem)
