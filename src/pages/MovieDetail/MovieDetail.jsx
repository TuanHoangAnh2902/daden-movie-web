import classNames from 'classnames/bind'
import styles from './MovieDetail.module.scss'

import { useGetMovieByIdQuery } from '~/services/ophimApi'
import MainContent from './MainContent/MainContent'
import SideContent from './SideContent/SideContent'

import { ConfigProvider, Layout, Skeleton } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { Content } from 'antd/es/layout/layout'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutTheme } from '~/themes/buttonTheme'

const cx = classNames.bind(styles)
function MovieDetail() {
	const [searchParams] = useSearchParams()
	const id = searchParams.get('id')

	const { data, isFetching, error } = useGetMovieByIdQuery(id)
	const movieData = data?.movie || {}

	// Scroll to top when component mounts or ID changes
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}, [id])

	// Error handling
	if (error) {
		return (
			<div className={cx('error-container')}>
				<h3>Đã xảy ra lỗi khi tải thông tin phim</h3>
				<p>{error.message || 'Vui lòng thử lại sau'}</p>
			</div>
		)
	}

	// Skeleton loading component
	const MovieDetailSkeleton = () => (
		<div className={cx('movie-detail')}>
			<div className={cx('movie-detail-wrapper')}>
				<Skeleton.Image
					className={cx('skeleton-poster')}
					active
					style={{ width: '100%', height: 'calc(100vh - 160px)' }}
				/>
			</div>
			<div className={cx('movie-detail-content')}>
				<ConfigProvider
					theme={{
						components: {
							Layout: {
								defaultBg: 'transparent',
								siderBg: 'transparent',
								triggerBg: 'transparent',
								lightTriggerColor: 'transparent',
								headerBg: 'transparent',
								bodyBg: 'transparent',
							},
						},
					}}>
					<Layout>
						<Sider width='25%'>
							<Skeleton active paragraph={{ rows: 10 }} />
						</Sider>
						<Content>
							<Skeleton active paragraph={{ rows: 15 }} />
						</Content>
					</Layout>
				</ConfigProvider>
			</div>
		</div>
	)

	return (
		<>
			{isFetching ? (
				<MovieDetailSkeleton />
			) : (
				<div className={cx('movie-detail')}>
					<div className={cx('movie-detail-wrapper')}>
						<img
							className={cx('movie-img')}
							src={movieData?.poster_url}
							alt={movieData?.name || 'Movie poster'}
							onError={(e) => {
								e.target.onerror = null
								e.target.src = 'https://placehold.co/1280x720/png?text=Image+Not+Available'
							}}
						/>
					</div>
					<div className={cx('movie-detail-content')}>
						<ConfigProvider theme={{ components: { Layout: LayoutTheme } }}>
							<Layout>
								<Sider width='25%'>
									<SideContent movieData={movieData} />
								</Sider>
								<Content>
									<MainContent data={data} />
								</Content>
							</Layout>
						</ConfigProvider>
					</div>
				</div>
			)}
		</>
	)
}

export default MovieDetail
