import { IoMdList } from 'react-icons/io'
import styles from './EpisodeTab.module.scss'
import classNames from 'classnames/bind'
import { Button, ConfigProvider, Dropdown, Flex, Space } from 'antd'
import { FaPlay, FaSortDown } from 'react-icons/fa6'
import PropTypes from 'prop-types'
import { useThemeColors } from '~/themes/useThemeColors'
import { LiaComment } from 'react-icons/lia'
import { Link, useSearchParams } from 'react-router-dom'
import LazyImage from '~/utils/Lazyimage'

const dropdownItems = [
	{
		label: <p>season 1</p>,
		key: '0',
	},
	{
		label: (
			<a href='https://www.aliyun.com' target='_blank' rel='noopener noreferrer'>
				2nd menu item
			</a>
		),
		key: '1',
	},
]

const cx = classNames.bind(styles)
function EpisodeTab({ data }) {
	console.log('🚀 ~ EpisodeTab ~ data:', data)
	const [searchParams] = useSearchParams()
	const movieEp = searchParams.get('ep')

	const { subColor } = useThemeColors()
	const episodeList = data?.episodes?.[0].server_data || []
	const isSingle = data?.movie?.type === 'single'
	const { thumb_url } = data?.movie || {}

	return (
		<div className={cx('episode-tab')}>
			{isSingle ? (
				<>
					<h5 className={cx('title')}>Các bản chiếu</h5>
					<Flex className={cx('slide-movies')} align='center' justify='flex-start'>
						<Space className={cx('info')} wrap size={12}>
							<Flex align='center' gap={4}>
								<LiaComment className={cx('vietsub-icon')} />
								<p>{data?.movie?.lang}</p>
							</Flex>
							<h5 className={cx('name')}>{data?.movie?.name}</h5>
							<ConfigProvider
								theme={{
									components: {
										Button: {
											defaultActiveColor: '#000',
											defaultActiveBg: subColor,
											defaultActiveBorderColor: subColor,
											defaultColor: '#000',
											colorPrimaryHover: subColor,
											defaultHoverBg: 'transparent',
										},
									},
								}}>
								<Link to={`/movie/watch?id=${data?.movie?._id}&ep=full`}>
									<Button className={cx('play-btn')}>Xem bản này</Button>
								</Link>
							</ConfigProvider>
						</Space>
						{thumb_url ? <LazyImage className={cx('thumb')} src={thumb_url} alt='Movie Thumbnail' /> : null}
					</Flex>
				</>
			) : (
				<ConfigProvider theme={{ token: { colorPrimary: 'red' } }}>
					<Dropdown className={cx('season-dropdown')} menu={{ items: dropdownItems }} trigger={['click']}>
						<a onClick={(e) => e.preventDefault()}>
							<Space align='center'>
								<IoMdList className={cx('list-icon')} />
								<p>Phần 1</p>
								<FaSortDown className={cx('down-icon')} />
							</Space>
						</a>
					</Dropdown>
				</ConfigProvider>
			)}
			<Flex className={cx('episode-list')} gap={6} align='start' wrap>
				{episodeList &&
					!isSingle &&
					episodeList?.map((ep, index) => (
						<Link key={index} to={`/movie/watch?id=${data?.movie?._id}&ep=${(ep.slug || ep.name)?.toLowerCase()}`}>
							<Flex
								className={cx('episode-item', {
									active: (ep.slug || ep.name)?.toLowerCase() === movieEp?.toLowerCase(),
								})}
								gap={8}
								align='center'
								justify='center'>
								<FaPlay />
								<p>Tập {ep.name}</p>
							</Flex>
						</Link>
					))}
			</Flex>
		</div>
	)
}
EpisodeTab.propTypes = {
	data: PropTypes.shape({
		episodes: PropTypes.arrayOf(
			PropTypes.shape({
				server_data: PropTypes.arrayOf(
					PropTypes.shape({
						name: PropTypes.string.isRequired,
					}),
				),
			}),
		),
		movie: PropTypes.shape({
			name: PropTypes.string,
			type: PropTypes.string,
			thumb_url: PropTypes.string,
			lang: PropTypes.string,
			_id: PropTypes.string, // Added _id validation
		}),
	}),
}

export default EpisodeTab
