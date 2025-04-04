import { CiCircleChevLeft } from 'react-icons/ci'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import styles from './WatchMovie.module.scss'
import classNames from 'classnames/bind'
import { useLazyGetMovieByIdQuery } from '~/services/ophimApi'
import { useEffect, useMemo, useState } from 'react'
import { ConfigProvider, Divider, Flex, Layout } from 'antd'
import VideoPlayer from './VideoPlayer/VideoPlayer'
import { TiHeartFullOutline } from 'react-icons/ti'
import { FaAngleRight, FaPlus } from 'react-icons/fa6'
import ImdbInfo from '~/components/common/ImdbInfo/ImdbInfo'
import CategoryInfo from '~/components/common/CategoriesInfo/CategoryInfo'
import Sider from 'antd/es/layout/Sider'
import { Content } from 'antd/es/layout/layout'
import { LayoutTheme } from '~/themes/buttonTheme'
import EpisodeTab from '../MovieDetail/MainContent/EpisodeTab/EpisodeTab'
import removeTagsUsingDOM from '~/utils/removeTagsUsingDOM'
import RecommentMovie from './RecommentMovie/RecommentMovie'
import ReactPlayer from 'react-player'

const cx = classNames.bind(styles)
function WatchMovie() {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const [fetchData, { data }] = useLazyGetMovieByIdQuery()
	console.log('🚀 ~ WatchMovie ~ data:', data)

	const episoleList = useMemo(() => data?.episodes?.[0].server_data || [], [data])
	console.log('🚀 ~ WatchMovie ~ episoleList:', episoleList)

	const currentEp = searchParams.get('ep')
	const [currentEpUrl, setCurrentEpUrl] = useState(null)
	console.log('🚀 ~ WatchMovie ~ currentEpUrl:', currentEpUrl)
	const [showEpisodeSelection, setShowEpisodeSelection] = useState(false)

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

	useEffect(() => {
		fetchData(movieId)
	}, [fetchData, movieId])

	const toggleEpisodeSelection = () => {
		setShowEpisodeSelection((prev) => !prev)
	}

	return (
		<div className={cx('wrapper')}>
			<div className={cx('watch-player')}>
				<Flex className={cx('title')} align='center' gap={8}>
					<CiCircleChevLeft className={cx('title-icon')} onClick={() => navigate(-1)} />
					<h5 className={cx('title-name')}>Xem phim {data?.movie?.name}</h5>
				</Flex>
				{currentEpUrl ? (
					<VideoPlayer key={currentEpUrl} src={currentEpUrl} />
				) : (
					<ReactPlayer url={data?.movie?.trailer_url} controls width='100%' height={900} />
				)}
				<Flex className={cx('player-controls')} align='center' gap={20}>
					<Flex align='center' gap={10} className={cx('control-item')}>
						<TiHeartFullOutline />
						<p>Yêu thích</p>
					</Flex>
					<Flex align='center' gap={10} className={cx('control-item')}>
						<FaPlus />
						<p>Thêm vào</p>
					</Flex>
					<Flex
						align='center'
						gap={10}
						className={cx('control-item', { active: showEpisodeSelection })}
						onClick={toggleEpisodeSelection}>
						<p>Chuyển tập</p>
						<p className={cx('transfer-episode')}>{showEpisodeSelection ? 'on' : 'off'}</p>
					</Flex>
				</Flex>

				{showEpisodeSelection && (
					<div className={cx('episode-selection-panel')}>
						<h4>Chọn tập phim</h4>
						<Flex className={cx('episodes-quick-select')} gap={6} align='start' wrap>
							{episoleList &&
								episoleList.map((ep, index) => (
									<Link
										key={index}
										to={`/movie/watch?id=${data?.movie?._id}&ep=${(ep.slug || ep.name)?.toLowerCase()}`}
										className={cx('episode-quick-item', {
											active: currentEp?.toLowerCase() === (ep.slug || ep.name)?.toLowerCase(),
										})}>
										<p>Tập {ep.name}</p>
									</Link>
								))}
						</Flex>
					</div>
				)}
			</div>
			<div className={cx('movie-info')}>
				<ConfigProvider theme={{ components: { Layout: LayoutTheme } }}>
					<Layout>
						<Content className={cx('info')}>
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
