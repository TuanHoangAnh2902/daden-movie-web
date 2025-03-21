import styles from './MovieCardHover.module.scss'
import classNames from 'classnames/bind'
import { Button, ConfigProvider, Flex } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import { FaPlay } from 'react-icons/fa6'
import buttonTheme from '~/themes/buttonTheme'
import PropTypes from 'prop-types'
import { LuDot } from 'react-icons/lu'
import { HeartFilled, InfoCircleFilled } from '@ant-design/icons'

const cx = classNames.bind(styles)
function MovieCardHover({ movieData, hoveredCard, cardPosition, handleMouseLeave, imageUrl }) {
	const imageBaseUrl = `${imageUrl}/uploads/movies/`
	return (
		<div>
			<AnimatePresence mode='sync'>
				{hoveredCard && (
					<motion.div
						key={hoveredCard}
						initial={{ opacity: 0, scale: 1 }}
						animate={{ opacity: 1, scale: 1.1 }}
						exit={{ opacity: 0, scale: 1 }}
						layoutId={hoveredCard}
						onMouseLeave={handleMouseLeave}
						transition={{ duration: 0.3 }}
						className={cx('card-detail')}
						style={{ top: cardPosition.top - 50, left: cardPosition.left - 80 }}>
						<div className={cx('card-detail-img-wrapper')}>
							<motion.img
								key={hoveredCard}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
								src={imageBaseUrl + movieData?.poster_url}
								alt={movieData?.name}
								className={cx('card-detail-img')}
							/>
						</div>
						<motion.div
							key={hoveredCard}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className={cx('card-detail-content')}>
							<h5 className={cx('name')}>{movieData?.name}</h5>
							<p className={cx('origin-name')}>{movieData?.origin_name}</p>
							<Flex gap={8} className={cx('card-detail-actions-btn')}>
								<ConfigProvider theme={buttonTheme}>
									<Button className={cx('play-btn')} icon={<FaPlay />}>
										Xem phim
									</Button>
								</ConfigProvider>
								<Button className={cx('action-btn')} type='text' icon={<HeartFilled />}>
									Thích
								</Button>
								<Button className={cx('action-btn')} type='text' icon={<InfoCircleFilled />}>
									Chi tiết
								</Button>
							</Flex>
							<Flex className={cx('imdb-info')} gap={6}>
								<div className={cx('imdb-info-item')}>{movieData?.year}</div>
								<div className={cx('imdb-info-item')}>{movieData?.lang}</div>
								<div className={cx('imdb-info-item')}>{movieData?.episode_current}</div>
								<div className={cx('imdb-info-item')}>{movieData?.time}</div>
							</Flex>

							<Flex className={cx('category-container')} gap={4}>
								{movieData?.category?.map((category) => (
									<Flex className={cx('category')} align='center' key={category?.id || Math.random()}>
										<LuDot className={cx('dot')} />
										<p className={cx('category-item')}>{category?.name || 'Unknown Category'}</p>
									</Flex>
								)) || <p className={cx('no-category')}>No categories available</p>}
							</Flex>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
MovieCardHover.propTypes = {
	movieData: PropTypes.object,
	hoveredCard: PropTypes.string,
	cardPosition: PropTypes.shape({
		top: PropTypes.number.isRequired,
		left: PropTypes.number.isRequired,
	}),
	handleMouseLeave: PropTypes.func.isRequired,
	imageUrl: PropTypes.string.isRequired,
}
export default MovieCardHover
