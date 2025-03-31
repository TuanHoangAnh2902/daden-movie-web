import { Flex } from 'antd'
import styles from './SideContent.module.scss'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import removeTagsUsingDOM from '~/utils/removeTagsUsingDOM'

const cx = classNames.bind(styles)
function SideContent({ movieData }) {
	return (
		<div className={cx('movie-detail-side')}>
			<div className={cx('movie-detail-side-wrapper')}>
				<div className={cx('movie-img')}>
					<img src={movieData?.thumb_url} alt='' />
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
				<Flex className={cx('category-container')} gap={10} wrap>
					{movieData.category?.map((category) => (
						<div key={category.id} className={cx('category-item')}>
							{category.name}
						</div>
					))}
				</Flex>
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
					<span className={cx('introduce-content')}>{movieData?.country?.[0]?.name}</span>
				</Flex>
				<Flex className={cx('movie-introduce')} align='center' gap={6}>
					<h5 className={cx('introduce-title')}>Trạng thái:</h5>
					<span className={cx('introduce-content')}>{movieData?.episode_current}</span>
				</Flex>
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
}

export default SideContent
