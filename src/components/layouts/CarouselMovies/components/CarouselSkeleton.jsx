import { Flex, Skeleton } from 'antd'
import classNames from 'classnames/bind'
import { memo } from 'react'
import styles from '../CarouselMovies.module.scss'

const cx = classNames.bind(styles)

const CarouselSkeleton = () => (
	<div className={cx('carousel-movies')}>
		<div className={cx('carousel-skeleton')}>
			<div className={cx('skeleton-img-wrapper')}>
				<Skeleton.Image className={cx('skeleton-img')} active />
			</div>
			<div className={cx('carousel-content')}>
				<Skeleton active paragraph={{ rows: 4 }} title={{ width: '60%' }} />
				<Skeleton.Button active size='large' shape='circle' style={{ width: 70, height: 70, marginTop: 20 }} />
			</div>
		</div>
		<Flex className={cx('carousel-paging-skeleton')} align='center' justify='center' gap={10}>
			{Array.from({ length: 5 }, (_, index) => (
				<Skeleton.Image className={cx('thumbnail-skeleton')} key={index} active />
			))}
		</Flex>
	</div>
)

CarouselSkeleton.displayName = 'CarouselSkeleton'

export default memo(CarouselSkeleton)
