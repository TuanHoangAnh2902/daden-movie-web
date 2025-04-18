import { ConfigProvider, Flex, Modal } from 'antd'
import styles from './GalleryTab.module.scss'
import classNames from 'classnames/bind'
import { useState } from 'react'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'
import { useThemeColors } from '~/themes/useThemeColors'
import { DropboxOutlined, PlayCircleFilled } from '@ant-design/icons'
import LazyImage from '~/utils/Lazyimage'

const cx = classNames.bind(styles)
function GalleryTab({ trailerData }) {
	const { trailer, images = [] } = trailerData

	const [isModalOpen, setIsModalOpen] = useState(false)

	const { bgColorLight } = useThemeColors()

	const showModal = () => {
		setIsModalOpen(true)
	}

	const handleCancel = () => {
		setIsModalOpen(false)
	}
	return (
		<div className={cx('gallery-tab')}>
			<h5 className={cx('title')}>Videos</h5>
			{trailer ? (
				<>
					<div className={cx('traler-img')} onClick={showModal}>
						<LazyImage src={images[0]} alt='Movie trailer thumbnail' />
						<PlayCircleFilled className={cx('play-icon')} />
					</div>

					<ConfigProvider theme={{ components: { Modal: { contentBg: bgColorLight, headerBg: bgColorLight } } }}>
						<Modal
							className={cx('trailer-modal')}
							title='trailer'
							centered
							open={isModalOpen}
							onCancel={handleCancel}
							okButtonProps={false}
							cancelButtonProps={false}
							width={800}
							destroyOnClose={true}
							footer={null}>
							<ReactPlayer url={trailer} controls width='100%' height='400px' />
						</Modal>
					</ConfigProvider>
				</>
			) : (
				<Flex align='center' justify='center' className={cx('no-video')} vertical gap={10}>
					<DropboxOutlined className={cx('no-video-icon')} />
					<span className={cx('no-video-text')}>Không có video nào</span>
				</Flex>
			)}
			<h5 className={cx('title')}>Ảnh</h5>
			<Flex className={cx('gallery')} wrap='wrap' gap={10}>
				{images?.map((src, index) => (
					<LazyImage className={cx('img')} key={index} src={src} alt={`Image ${index + 1}`} />
				))}
			</Flex>
		</div>
	)
}
GalleryTab.propTypes = {
	trailerData: PropTypes.shape({
		trailer: PropTypes.string,
		images: PropTypes.arrayOf(PropTypes.string),
	}),
}

export default GalleryTab
