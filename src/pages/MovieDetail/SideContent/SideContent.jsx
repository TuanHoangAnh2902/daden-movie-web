import { Flex, Skeleton } from 'antd'
import styles from './SideContent.module.scss'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import removeTagsUsingDOM from '~/utils/removeTagsUsingDOM'
import { memo } from 'react'
import CategoryInfo from '~/components/common/CategoriesInfo/CategoryInfo'
import ShareMovie from '~/components/movie/ShareMovie/ShareMovie'

const cx = classNames.bind(styles)
function SideContent({ movieData, isLoading }) {
	// Render skeleton while loading
	if (isLoading) {
		return (
			<div className={cx('movie-detail-side')}>
				<div className={cx('movie-detail-side-wrapper')}>
					<div className={cx('movie-img')}>
						<Skeleton.Image active style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
					</div>
					<div className={cx('movie-info')}>
						<Skeleton active paragraph={false} title={{ width: '80%' }} />
						<Skeleton active paragraph={false} title={{ width: '60%' }} style={{ marginTop: '8px' }} />
					</div>
					<Flex className={cx('imdb-info')} gap={10} wrap>
						{[...Array(4)].map((_, i) => (
							<Skeleton.Button active key={i} size='small' shape='round' />
						))}
					</Flex>
					<Flex className={cx('category-container')} gap={10} wrap>
						{[...Array(3)].map((_, i) => (
							<Skeleton.Button active key={i} size='small' shape='round' />
						))}
					</Flex>
					<Flex className={cx('movie-introduce')} vertical gap={8}>
						<Skeleton active paragraph={{ rows: 4 }} />
					</Flex>
				</div>
			</div>
		)
	}

	return (
		<div className={cx('movie-detail-side')}>
			<div className={cx('movie-detail-side-wrapper')}>
				<div className={cx('movie-img')}>
					<img
						src={movieData?.thumb_url}
						alt={movieData?.name || 'Movie thumbnail'}
						onError={(e) => {
							e.target.onerror = null
							e.target.src = 'https://placehold.co/300x450/png?text=No+Image'
						}}
					/>
				</div>
				<div className={cx('movie-info')}>
					<h5 className={cx('movie-name')}>{movieData?.name}</h5>
					<p className={cx('movie-origin-name')}>{movieData?.origin_name}</p>
				</div>
				<Flex className={cx('imdb-info')} gap={10} wrap>
					<div className={cx('imdb-info-item')}>{movieData.year}</div>
					<div className={cx('imdb-info-item')}>{movieData.lang}</div>
					<div className={cx('imdb-info-item')}>{movieData.episode_current}</div>
					<div className={cx('imdb-info-item')}>{movieData.time}</div>
				</Flex>
				<CategoryInfo categoryData={movieData.category} />
				<Flex className={cx('movie-introduce')} vertical gap={8}>
					{movieData?.content && (
						<>
							<h5 className={cx('introduce-title')}>Giới thiệu</h5>
							<p className={cx('introduce-content')}>{removeTagsUsingDOM(movieData?.content)}</p>
						</>
					)}
				</Flex>
				<Flex className={cx('movie-introduce')} align='center' gap={6}>
					<h5 className={cx('introduce-title')}>Thời lượng:</h5>
					<span className={cx('introduce-content')}>{movieData?.time}</span>
				</Flex>
				<Flex className={cx('movie-introduce')} align='center' gap={6}>
					<h5 className={cx('introduce-title')}>Quốc gia:</h5>
					{movieData?.country?.map((country, index) => (
						<span key={index} className={cx('introduce-content')}>
							{country.name}
							{index !== movieData.country.length - 1 && ', '}
						</span>
					))}
				</Flex>
				<Flex className={cx('movie-introduce')} align='center' gap={6}>
					<h5 className={cx('introduce-title')}>Tình trạng:</h5>
					<span className={cx('introduce-content')}>{movieData?.episode_current}</span>
				</Flex>
				
				{/* Integrated ShareMovie component */}
				<ShareMovie movieData={movieData} />
			</div>
		</div>
	)
}
SideContent.propTypes = {
	movieData: PropTypes.shape({
		thumb_url: PropTypes.string,
		name: PropTypes.string,
		origin_name: PropTypes.string,
		year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		lang: PropTypes.string,
		episode_current: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		time: PropTypes.string,
		category: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
				name: PropTypes.string,
			}),
		),
		content: PropTypes.string,
		country: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string,
			}),
		),
	}),
	isLoading: PropTypes.bool,
}

// Using memo to prevent unnecessary re-renders
export default memo(SideContent)
