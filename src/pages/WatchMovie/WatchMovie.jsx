import { ConfigProvider, Divider, Flex, Layout, Switch } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { Content } from 'antd/es/layout/layout'
import classNames from 'classnames/bind'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CiCircleChevLeft } from 'react-icons/ci'
import { FaAngleRight, FaPlus } from 'react-icons/fa6'
import { MdAutorenew } from 'react-icons/md'
import { TiHeartFullOutline } from 'react-icons/ti'
import ReactPlayer from 'react-player'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import CategoryInfo from '~/components/common/CategoriesInfo/CategoryInfo'
import ImdbInfo from '~/components/common/ImdbInfo/ImdbInfo'
import { useLazyGetMovieByIdQuery } from '~/services/ophimApi'
import { LayoutTheme } from '~/themes/buttonTheme'
import { useThemeColors } from '~/themes/useThemeColors'
import removeTagsUsingDOM from '~/utils/removeTagsUsingDOM'
import EpisodeTab from '../MovieDetail/MainContent/EpisodeTab/EpisodeTab'
import RecommentMovie from './RecommentMovie/RecommentMovie'
import VideoPlayer from './VideoPlayer/VideoPlayer'
import styles from './WatchMovie.module.scss'

const cx = classNames.bind(styles)

function WatchMovie() {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const [fetchData, { data }] = useLazyGetMovieByIdQuery()

	const { subColor } = useThemeColors()

	// Sử dụng useRef thay vì useState để không gây re-render khi thay đổi
	const autoPlayNextRef = useRef(true) // Mặc định bật tự động chuyển tập
	// State chỉ dùng cho UI, không kết nối với logic xử lý video
	const [autoPlayNextUI, setAutoPlayNextUI] = useState(true)

	const episoleList = useMemo(() => data?.episodes?.[0].server_data || [], [data])

	const currentEp = searchParams.get('ep')
	const [currentEpUrl, setCurrentEpUrl] = useState(null)

	// Lưu trữ tham chiếu đến movieId và data để dùng trong callbacks
	const movieIdRef = useRef(null)
	const dataRef = useRef(null)

	// Cập nhật refs khi data thay đổi
	useEffect(() => {
		if (data?.movie?._id) {
			dataRef.current = data
		}
	}, [data])

	// Tìm index của tập hiện tại và tiếp theo
	const currentEpIndex = useMemo(() => {
		if (!currentEp || !episoleList.length) return 0
		const index = episoleList.findIndex((item) => (item.slug || item.name)?.toLowerCase() === currentEp?.toLowerCase())
		return index !== -1 ? index : 0
	}, [currentEp, episoleList])

	useEffect(() => {
		if (currentEp) {
			const episode = episoleList.find((item) => (item.slug || item.name)?.toLowerCase() === currentEp?.toLowerCase())
			if (episode) {
				setCurrentEpUrl(episode.link_m3u8)
			}
		} else {
			setCurrentEpUrl(episoleList[0]?.link_m3u8)
		}
	}, [currentEp, episoleList])

	const movieId = searchParams.get('id')

	// Lưu movieId vào ref để các callback có thể truy cập mà không phụ thuộc vào re-render
	useEffect(() => {
		movieIdRef.current = movieId
	}, [movieId])

	useEffect(() => {
		fetchData(movieId)
	}, [fetchData, movieId])

	// Xử lý khi video kết thúc để tự động chuyển tập tiếp theo
	// QUAN TRỌNG: Hàm này không phụ thuộc vào autoPlayNext state
	// mà sử dụng giá trị từ ref để không gây re-render VideoPlayer
	const handleVideoEnded = useCallback(() => {
		// Dùng ref value để kiểm tra bật/tắt
		if (!autoPlayNextRef.current || !episoleList.length) return

		// Nếu còn tập tiếp theo
		if (currentEpIndex < episoleList.length - 1) {
			const nextEpisode = episoleList[currentEpIndex + 1]
			const nextEpSlug = nextEpisode.slug || nextEpisode.name
			const currentMovieId = dataRef.current?.movie?._id || movieIdRef.current

			// Chuyển đến tập tiếp theo
			navigate(`/movie/watch?id=${currentMovieId}&ep=${nextEpSlug?.toLowerCase()}`)
		}
	}, [episoleList, currentEpIndex, navigate])

	// Chuyển tới tập tiếp theo
	const goToNextEpisode = useCallback(() => {
		if (currentEpIndex < episoleList.length - 1) {
			const nextEpisode = episoleList[currentEpIndex + 1]
			const nextEpSlug = nextEpisode.slug || nextEpisode.name
			navigate(`/movie/watch?id=${data?.movie?._id}&ep=${nextEpSlug?.toLowerCase()}`)
		}
	}, [currentEpIndex, episoleList, navigate, data?.movie?._id])

	// Chuyển tới tập trước đó
	const goToPreviousEpisode = useCallback(() => {
		if (currentEpIndex > 0) {
			const prevEpisode = episoleList[currentEpIndex - 1]
			const prevEpSlug = prevEpisode.slug || prevEpisode.name
			navigate(`/movie/watch?id=${data?.movie?._id}&ep=${prevEpSlug?.toLowerCase()}`)
		}
	}, [currentEpIndex, episoleList, navigate, data?.movie?._id])

	// Xử lý khi thay đổi trạng thái tự động chuyển tập
	const handleAutoPlayToggle = useCallback((checked) => {
		// Cập nhật cả state UI và giá trị trong ref
		setAutoPlayNextUI(checked)
		autoPlayNextRef.current = checked
	}, [])

	// Memoize video player để tránh render lại khi không cần thiết
	const videoPlayerMemo = useMemo(() => {
		if (!currentEpUrl) {
			return <ReactPlayer url={data?.movie?.trailer_url} controls width='100%' height={900} />
		}

		// Đảm bảo key chỉ thay đổi khi URL thay đổi
		return (
			<div className={cx('video-container-wrapper')} key={`video-wrapper-${currentEpUrl}`}>
				<VideoPlayer key={currentEpUrl} src={currentEpUrl} onVideoEnded={handleVideoEnded} />
			</div>
		)
	}, [currentEpUrl, handleVideoEnded, data?.movie?.trailer_url])

	useEffect(() => {
		window.scrollTo({ top: 200, behavior: 'smooth' })
	}, [])

	return (
		<div className={cx('wrapper')}>
			<div className={cx('watch-player')}>
				<Flex className={cx('title')} align='center' gap={8}>
					<CiCircleChevLeft className={cx('title-icon')} onClick={() => navigate(-1)} />
					<h5 className={cx('title-name')}>Xem phim {data?.movie?.name}</h5>
				</Flex>
				{videoPlayerMemo}
				<Flex className={cx('player-controls')} align='center' gap={20}>
					<Flex align='center' gap={10} className={cx('control-item')}>
						<TiHeartFullOutline />
						<p>Yêu thích</p>
					</Flex>
					<Flex align='center' gap={10} className={cx('control-item')}>
						<FaPlus />
						<p>Thêm vào</p>
					</Flex>

					<Flex align='center' gap={10} className={cx('control-item')}>
						<MdAutorenew />
						<p>Tự động chuyển tập</p>
						<ConfigProvider theme={{ components: { Switch: { colorPrimary: subColor, colorPrimaryHover: subColor } } }}>
							<Switch
								checkedChildren='on'
								unCheckedChildren='off'
								checked={autoPlayNextUI}
								onChange={handleAutoPlayToggle}
								size='default'
							/>
						</ConfigProvider>
					</Flex>
				</Flex>

				{/* Điều khiển chuyển tập */}
				{currentEpIndex > 0 && (
					<button className={cx('nav-episode', 'prev-episode')} onClick={goToPreviousEpisode}>
						Tập trước
					</button>
				)}

				{currentEpIndex < episoleList.length - 1 && (
					<button className={cx('nav-episode', 'next-episode')} onClick={goToNextEpisode}>
						Tập sau
					</button>
				)}
			</div>

			{/* Phần thông tin phim */}
			<div className={cx('movie-info')}>
				<ConfigProvider theme={{ components: { Layout: LayoutTheme } }}>
					<Layout>
						<Content className={cx('info')}>
							{/* ... Nội dung phần thông tin phim giữ nguyên ... */}
							<Flex justify='space-between'>
								<Flex align='center' gap={24} justify='flex-start'>
									<div className={cx('movie-img')}>
										<img src={data?.movie?.thumb_url} alt='' />
									</div>
									<Flex className={cx('movie-info-content')} vertical>
										<h5 className={cx('movie-name')}>{data?.movie?.name}</h5>
										<p className={cx('movie-origin-name')}>{data?.movie?.origin_name}</p>
										<ImdbInfo ImdbData={data?.movie} />
										<CategoryInfo categoryData={data?.movie?.category} />
									</Flex>
								</Flex>
								<Flex vertical gap={20}>
									<p className={cx('movie-info-description')}>{removeTagsUsingDOM(data?.movie?.content)}</p>
									<Flex align='center' gap={4} className={cx('view-more')}>
										<Link className={cx('view-more-text')} to={`/movie/detail?id=${data?.movie?._id}`}>
											Thông tin phim
										</Link>
										<FaAngleRight />
									</Flex>
								</Flex>
							</Flex>
							<Divider className={cx('divider')} />
							{currentEpUrl && <EpisodeTab data={data} />}
						</Content>
						<Divider className={cx('vertical-divider')} type='vertical' />
						<Sider className={cx('recomment')} width='28%'>
							<RecommentMovie movieData={data?.movie} />
						</Sider>
					</Layout>
				</ConfigProvider>
			</div>
		</div>
	)
}

export default WatchMovie
