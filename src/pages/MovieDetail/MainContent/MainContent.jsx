import { Button, ConfigProvider, Flex, Tabs } from 'antd'
import styles from './MainContent.module.scss'
import classNames from 'classnames/bind'
import buttonTheme from '~/themes/buttonTheme'
import { TiHeartFullOutline } from 'react-icons/ti'
import { FaComments, FaPlay, FaPlus } from 'react-icons/fa'
import { IoIosSend } from 'react-icons/io'
import { useThemeColors } from '~/themes/useThemeColors'
import EpisodeTab from './EpisodeTab/EpisodeTab'
import PropTypes from 'prop-types'
import RecommentTab from './RecommentTab/RecommentTab'
import GalleryTab from './GalleryTab/GalleryTab'
import { BsCameraVideoFill } from 'react-icons/bs'

const cx = classNames.bind(styles)
function MainContent({ data }) {
	console.log('🚀 ~ MainContent ~ data:', data)
	const { subColor, textColor } = useThemeColors()

	// eslint-disable-next-line no-unused-vars
	const onChange = (key) => {
		// console.log(key)
	}

	const trailerData = {
		trailer: data?.movie?.trailer_url,
		images: [data?.movie?.poster_url, data?.movie?.thumb_url],
	}

	const completedMovieTabsItems = [
		{
			key: '1',
			label: 'Tập phim',
			children: <EpisodeTab data={data} />,
		},
		{
			key: '2',
			label: 'Gallery',
			children: <GalleryTab trailerData={trailerData} />,
		},
		{
			key: '3',
			label: 'Diễn viên',
			children: 'Content of Tab Pane 3',
		},
		{
			key: '4',
			label: 'Đề xuất',
			children: <RecommentTab movieData={data?.movie} />,
		},
	]

	const trailerMovieTabsItems = completedMovieTabsItems.filter((item) => item.key !== '1')
	let isTrailerOnly = data?.episodes?.[0]?.server_data?.[0]?.filename === ''
	let tabsItems = isTrailerOnly ? trailerMovieTabsItems : completedMovieTabsItems

	return (
		<div className={cx('movie-detail-main')}>
			<div className={cx('movie-detail-main-wrapper')}>
				<Flex align='center' gap={30} className={cx('movie-detail-main-content')}>
					{isTrailerOnly ? (
						<div className={cx('trailer-btn')}>
							<Flex align='center' gap={10} className={cx('button')}>
								<BsCameraVideoFill className={cx('trailer-icon')} />
								<p>Xem trailer</p>
							</Flex>
							<Flex className={cx('trailer-text')} align='center' justify='center'>
								<p>Phim sắp ra mắt</p>
							</Flex>
						</div>
					) : (
						<ConfigProvider
							theme={{ components: { Button: { ...buttonTheme, contentFontSize: 17, fontWeight: 500 } } }}>
							<Button className={cx('play-btn')} shape='round' icon={<FaPlay />}>
								Xem ngay
							</Button>
						</ConfigProvider>
					)}

					<Flex vertical gap={10} className={cx('favorite-btn')} align='center'>
						<TiHeartFullOutline />
						<p>Yêu thích</p>
					</Flex>
					<Flex vertical gap={10} className={cx('favorite-btn')} align='center'>
						<FaPlus />
						<p>Thêm vào</p>
					</Flex>
					<Flex vertical gap={10} className={cx('favorite-btn')} align='center'>
						<IoIosSend />
						<p>Chia sẻ</p>
					</Flex>
					<Flex vertical gap={10} className={cx('favorite-btn')} align='center'>
						<FaComments />
						<p>Bình luận</p>
					</Flex>
				</Flex>
				<ConfigProvider
					theme={{
						components: {
							Tabs: {
								itemActiveColor: subColor,
								inkBarColor: subColor,
								itemSelectedColor: subColor,
								itemHoverColor: subColor,
							},
						},
						token: { colorText: textColor },
					}}>
					<Tabs
						tabBarStyle={{ fontSize: '14px', lineHeight: '22px', fontWeight: 500, opacity: 0.9 }}
						animated={true}
						className={cx('tabs-detail')}
						defaultActiveKey='1'
						items={tabsItems}
						onChange={onChange}
					/>
				</ConfigProvider>
			</div>
		</div>
	)
}
MainContent.propTypes = {
	data: PropTypes.object.isRequired,
}

export default MainContent
