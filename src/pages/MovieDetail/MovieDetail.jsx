import styles from './MovieDetail.module.scss'
import classNames from 'classnames/bind'

import SideContent from './SideContent/SideContent'
import MainContent from './MainContent/MainContent'
import { useGetMovieByIdQuery } from '~/services/ophimApi'

import { ConfigProvider, Layout } from 'antd'
import { useSearchParams } from 'react-router-dom'
import Sider from 'antd/es/layout/Sider'
import { Content } from 'antd/es/layout/layout'

const cx = classNames.bind(styles)
function MovieDetail() {
	const [searchParams] = useSearchParams()
	const id = searchParams.get('id')

	const { data, isFetching } = useGetMovieByIdQuery(id)
	console.log('🚀 ~ MovieDetail ~ data:', data)
	const movieData = data?.movie || {}

	return (
		<>
			{!isFetching ? (
				<div className={cx('movie-detail')}>
					<div className={cx('movie-detail-wrapper')}>
						<img
							className={cx('movie-img')}
							src={movieData?.poster_url}
							alt='thumbnail'
							onError={(e) => console.log(e)}
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
									<SideContent movieData={movieData} />
								</Sider>
								<Content>
									<MainContent data={data} />
								</Content>
							</Layout>
						</ConfigProvider>
					</div>
				</div>
			) : (
				<div>loading</div>
			)}
		</>
	)
}

export default MovieDetail
