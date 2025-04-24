import { Button, Flex, message, Modal, Tooltip } from 'antd'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import styles from './ShareMovie.module.scss'
import { useEffect, useState } from 'react'
import { LinkOutlined, InfoCircleOutlined } from '@ant-design/icons'

// Import react-share components
import { FacebookIcon, TwitterShareButton, TwitterIcon, PinterestShareButton, PinterestIcon } from 'react-share'

const cx = classNames.bind(styles)

function ShareMovie({ movieData, isOpen, onClose }) {
	// State để lưu thông tin phim cần thiết cho việc chia sẻ
	const [shareData, setShareData] = useState({
		url: '',
		title: '',
		description: '',
		image: '',
	})

	// Kiểm tra xem URL có phải là localhost hay không
	const [isLocalhost, setIsLocalhost] = useState(false)

	// Cập nhật dữ liệu chia sẻ khi movieData thay đổi hoặc component mount
	useEffect(() => {
		if (!movieData) return

		const currentUrl = window.location.href
		// Kiểm tra xem URL có chứa localhost hoặc 127.0.0.1 không
		const isLocalDevelopment =
			currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1') || currentUrl.includes('192.168.')

		setIsLocalhost(isLocalDevelopment)

		// URL dùng để chia sẻ
		// Trong môi trường sản xuất, sử dụng URL thật
		// Trong môi trường phát triển, nếu là localhost, có thể thay thế bằng URL giả
		const shareUrl = isLocalDevelopment
			? `https://demo-daden-movies.example.com/movie?id=${movieData?._id}` // Thay thế bằng URL giả
			: currentUrl

		// Chuẩn bị dữ liệu chia sẻ
		setShareData({
			url: shareUrl, // Thay URL localhost bằng URL giả nếu cần
			title: movieData?.name || 'Phim hay',
			description: movieData?.content
				? movieData.content.substring(0, 150).replace(/<\/?[^>]+(>|$)/g, '') + '...'
				: 'Xem phim hay tại website của chúng tôi',
			image: movieData?.thumb_url || movieData?.poster_url || '',
		})
	}, [movieData])

	// Xử lý chia sẻ qua Facebook trực tiếp
	const handleFacebookShare = () => {
		// Tạo URL Facebook share với các tham số
		const fbShareUrl = `https://www.facebook.com/dialog/share?app_id=184484190795&href=${encodeURIComponent(
			shareData.url,
		)}&hashtag=%23phimhay&quote=${encodeURIComponent(`${shareData.title} - ${shareData.description}`)}`

		// Mở popup cửa sổ chia sẻ với kích thước tối ưu
		const width = 550
		const height = 450
		const left = (window.screen.width - width) / 2
		const top = (window.screen.height - height) / 2

		window.open(
			fbShareUrl,
			'Chia sẻ lên Facebook',
			`width=${width},height=${height},top=${top},left=${left},toolbar=0,location=0,menubar=0,status=0`,
		)
	}

	// Xử lý sao chép liên kết
	const handleCopyLink = () => {
		navigator.clipboard
			.writeText(shareData.url)
			.then(() => {
				message.success('Đã sao chép liên kết phim')
			})
			.catch(() => {
				message.error('Không thể sao chép liên kết')
			})
	}

	// Kích thước chung cho các nút chia sẻ
	const iconSize = 36
	const iconRadius = 8

	const shareButtonsContent = (
		<div className={cx('share-container')}>
			{isLocalhost && (
				<div className={cx('localhost-warning')}>
					<InfoCircleOutlined />
					<span>Bạn đang sử dụng địa chỉ localhost. Chia sẻ có thể không hoạt động chính xác với người nhận.</span>
				</div>
			)}
			<Flex className={cx('share-buttons')} gap={16} wrap>
				{/* Nút chia sẻ Facebook */}
				<Tooltip title='Chia sẻ lên Facebook'>
					<Button
						// type='primary'
						className={cx('custom-fb-btn')}
						onClick={handleFacebookShare}
						icon={<FacebookIcon size={iconSize} round={iconRadius} />}
						style={{ padding: 0, width: iconSize, height: iconSize, overflow: 'hidden', border: 'none' }}
					/>
				</Tooltip>

				<TwitterShareButton
					url={shareData.url}
					title={shareData.title}
					via='dadenmovies'
					hashtags={['phimhay', 'phimmoi']}>
					<TwitterIcon size={iconSize} round={iconRadius} />
				</TwitterShareButton>

				{shareData.image && (
					<PinterestShareButton url={shareData.url} media={shareData.image} description={shareData.title}>
						<PinterestIcon size={iconSize} round={iconRadius} />
					</PinterestShareButton>
				)}

				<Tooltip title='Sao chép liên kết'>
					<Button
						type='primary'
						shape='circle'
						icon={<LinkOutlined />}
						onClick={handleCopyLink}
						className={cx('link-btn')}
						style={{ width: iconSize, height: iconSize }}
					/>
				</Tooltip>
			</Flex>
		</div>
	)

	// Nếu có props isOpen và onClose, hiển thị trong modal
	if (isOpen !== undefined && onClose !== undefined) {
		return (
			<Modal title='Chia sẻ phim' open={isOpen} onCancel={onClose} footer={null} centered className={cx('share-modal')}>
				{shareButtonsContent}
			</Modal>
		)
	}

	// Nếu không, hiển thị như trước đây
	return shareButtonsContent
}

ShareMovie.propTypes = {
	movieData: PropTypes.shape({
		name: PropTypes.string,
		content: PropTypes.string,
		thumb_url: PropTypes.string,
		poster_url: PropTypes.string,
		_id: PropTypes.string,
	}),
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
}

export default ShareMovie
