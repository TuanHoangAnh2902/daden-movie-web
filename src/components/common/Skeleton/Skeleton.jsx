import { Flex, Skeleton } from 'antd'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import styles from './Skeleton.module.scss'
import { useThemeColors } from '~/themes/useThemeColors'

const cx = classNames.bind(styles)

// MovieCard skeleton for vertical and horizontal cards
export const MovieCardSkeleton = ({ direction = 'vertical', count = 1 }) => {
	const { cardHeightHorizontal, cardHeightVertical, cardWidthHorizontal, cardWidthVertical } = useThemeColors()

	const renderSkeleton = () => (
		<div className={cx('movie-card-skeleton', direction)}>
			<Skeleton.Image
				active
				className={cx('skeleton-img')}
				style={{
					width: direction === 'vertical' ? cardWidthVertical : cardWidthHorizontal,
					height: direction === 'vertical' ? cardHeightVertical : cardHeightHorizontal,
					borderRadius: '8px',
				}}
			/>
			<div className={cx('skeleton-content')}>
				<Skeleton active paragraph={false} title={{ width: '100%' }} />
				{direction === 'horizontal' && (
					<Skeleton active paragraph={false} title={{ width: '70%', style: { marginTop: '4px' } }} />
				)}
			</div>
		</div>
	)

	if (count === 1) return renderSkeleton()

	return (
		<Flex gap={16} wrap>
			{Array.from({ length: count }).map((_, index) => (
				<div key={index}>{renderSkeleton()}</div>
			))}
		</Flex>
	)
}

// Detail page skeleton with sidebar and content
export const DetailPageSkeleton = () => {
	return (
		<div className={cx('detail-page-skeleton')}>
			<div className={cx('detail-poster')}>
				<Skeleton.Image active className={cx('poster-img')} />
			</div>
			<Flex className={cx('detail-layout')}>
				<div className={cx('side-content')}>
					<Skeleton active paragraph={{ rows: 1 }} title={{ width: '80%' }} />
					<Skeleton active paragraph={false} title={{ width: '60%' }} />
					<Flex gap={8} className={cx('badges-row')}>
						{[...Array(4)].map((_, i) => (
							<Skeleton.Button active key={i} size='small' shape='round' />
						))}
					</Flex>
					<Flex gap={8} className={cx('badges-row')} wrap>
						{[...Array(3)].map((_, i) => (
							<Skeleton.Button active key={i} size='small' shape='round' />
						))}
					</Flex>
					<Skeleton active paragraph={{ rows: 4 }} />
				</div>
				<div className={cx('main-content')}>
					<Skeleton active paragraph={{ rows: 8 }} />
					<Skeleton active paragraph={{ rows: 5 }} />
				</div>
			</Flex>
		</div>
	)
}

// Carousel skeleton with main image and thumbnails
export const CarouselSkeleton = () => {
	return (
		<div className={cx('carousel-skeleton')}>
			<div className={cx('main-image')}>
				<Skeleton.Image active className={cx('banner-img')} />
				<div className={cx('banner-content')}>
					<Skeleton active paragraph={{ rows: 3 }} title={{ width: '60%' }} />
					<Skeleton.Button active size='large' shape='circle' style={{ width: 70, height: 70, marginTop: 20 }} />
				</div>
			</div>
			<Flex className={cx('thumbnails')} align='center' justify='center' gap={10}>
				{[...Array(5)].map((_, index) => (
					<Skeleton.Image key={index} active className={cx('thumbnail-img')} />
				))}
			</Flex>
		</div>
	)
}

// Comments section skeleton
export const CommentsSkeleton = ({ count = 3 }) => {
	return (
		<div className={cx('comments-skeleton')}>
			{[...Array(count)].map((_, index) => (
				<div key={index} className={cx('comment-item')}>
					<Flex gap={12}>
						<Skeleton.Avatar active size='large' />
						<div className={cx('comment-content', { indented: index % 2 === 1 })}>
							<Skeleton active paragraph={{ rows: 2 }} title={{ width: '30%' }} />
						</div>
					</Flex>
				</div>
			))}
		</div>
	)
}

// List skeleton for lists of items
export const ListSkeleton = ({ count = 5, hasImage = true }) => {
	return (
		<div className={cx('list-skeleton')}>
			{[...Array(count)].map((_, index) => (
				<Flex key={index} gap={12} className={cx('list-item')}>
					{hasImage && <Skeleton.Image active />}
					<div className={cx('list-content')}>
						<Skeleton active paragraph={{ rows: 1 }} title={{ width: '80%' }} />
					</div>
				</Flex>
			))}
		</div>
	)
}

MovieCardSkeleton.propTypes = {
	direction: PropTypes.oneOf(['vertical', 'horizontal']),
	count: PropTypes.number,
}

CommentsSkeleton.propTypes = {
	count: PropTypes.number,
}

ListSkeleton.propTypes = {
	count: PropTypes.number,
	hasImage: PropTypes.bool,
}

export default {
	MovieCardSkeleton,
	DetailPageSkeleton,
	CarouselSkeleton,
	CommentsSkeleton,
	ListSkeleton,
}
