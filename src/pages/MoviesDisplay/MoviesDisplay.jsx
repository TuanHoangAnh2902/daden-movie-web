import { Row, Col, Typography, Spin, ConfigProvider, Pagination } from 'antd'
import MovieCardWithHover from '~/components/movie/MovieCardWithHover/MovieCardWithHover'
import PropTypes from 'prop-types'
import styles from './MoviesDisplay.module.scss'
import classNames from 'classnames/bind'
import { useThemeColors } from '~/themes/useThemeColors'

const cx = classNames.bind(styles)

const MoviesDisplay = ({
	randomColor = '',
	titlePage,
	imageUrl,
	movies,
	totalMovies,
	itemsPerPage,
	isLoading,
	isError,
	error,
	currentPage,
	setCurrentPage,
}) => {
	const { bgColorLight, textColor } = useThemeColors()

	const handlePageChange = (page) => {
		setCurrentPage(page)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	if (isError) {
		return <div className={cx('movies-list-error')}>Error: {error?.message || 'Failed to load movies'}</div>
	}

	return (
		<div
			className={cx('movies-list-container')}
			style={{ background: `linear-gradient(to bottom, ${randomColor} 1%, rgba(40, 43, 58, 1) 50%)` }}>
			<div className={cx('movies-list-wrapper')}>
				<Typography.Title
					className={cx('movies-list-title')}
					style={{
						background: randomColor ? `-webkit-linear-gradient(45deg, ${randomColor}, #fff)` : 'none',
						fontWeight: 600,
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: randomColor ? 'transparent' : textColor,
					}}>
					{titlePage}
				</Typography.Title>

				{isLoading ? (
					<div className={cx('loading-container')}>
						<Spin size='large' />
					</div>
				) : (
					<Row justify='center' align='center' gutter={[16, 20]} className={cx('movies-list')}>
						{movies?.map((item) => (
							<Col key={item?._id} span={3} xxl={3} xl={3} lg={4} md={6} sm={8} xs={12}>
								<MovieCardWithHover imageUrl={imageUrl} movieData={item} direction='vertical' />
							</Col>
						))}
					</Row>
				)}
			</div>

			{!isLoading && totalMovies > itemsPerPage && (
				<ConfigProvider
					theme={{
						token: { colorBorder: 'none', lineWidth: '0', colorText: textColor, colorBgContainer: bgColorLight },
						components: { Pagination: { itemBg: bgColorLight } },
					}}>
					<Pagination
						align='center'
						responsive
						showQuickJumper
						current={currentPage}
						total={totalMovies}
						pageSize={itemsPerPage}
						onChange={handlePageChange}
						showSizeChanger={false}
						className={cx('pagination')}
					/>
				</ConfigProvider>
			)}
		</div>
	)
}

MoviesDisplay.propTypes = {
	randomColor: PropTypes.string,
	titlePage: PropTypes.string,
	movies: PropTypes.array.isRequired,
	imageUrl: PropTypes.string.isRequired,
	totalMovies: PropTypes.number,
	itemsPerPage: PropTypes.number,
	isLoading: PropTypes.bool,
	isError: PropTypes.bool,
	error: PropTypes.object,
	currentPage: PropTypes.number,
	setCurrentPage: PropTypes.func,
}

export default MoviesDisplay
