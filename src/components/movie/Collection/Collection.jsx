import { AnimatePresence, motion } from 'framer-motion'

import Typography from 'antd/es/typography/Typography'
import styles from './Collection.module.scss'
import classNames from 'classnames/bind'
import { Flex } from 'antd'
import { FaChevronRight } from 'react-icons/fa'
import { useState } from 'react'

const cx = classNames.bind(styles)
function Collection() {
	const [isHovered, setIsHovered] = useState(false)
	return (
		<div className={cx('collection')}>
			<Flex className={cx('collection-title')} align='center' gap={20}>
				<Typography.Title className={cx('title')} level={2}>
					Collection
				</Typography.Title>
				<AnimatePresence mode='wait'>
					<motion.div
						animate={{ width: isHovered ? '120px' : '33px' }}
						transition={{ duration: 0.3 }}
						className={cx('view-more')}
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}>
						<AnimatePresence mode='sync'>
							{isHovered ? (
								<motion.p
									initial={{ width: '0%' }}
									animate={{ width: '100%' }}
									exit={{ width: '0%' }}
									transition={{ duration: 0.3 }}>
									Xem thêm
								</motion.p>
							) : null}
						</AnimatePresence>
						<FaChevronRight />
					</motion.div>
				</AnimatePresence>
			</Flex>
		</div>
	)
}

export default Collection
