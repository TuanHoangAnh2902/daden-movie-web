import { Button, ConfigProvider, Empty, Flex, Select, Space, Spin, Typography, message } from 'antd'
import styles from './Favourite.module.scss'
import classNames from 'classnames/bind'
import { useCallback, useEffect, useState } from 'react'
import { DeleteOutlined, SortAscendingOutlined } from '@ant-design/icons'
import { getSortedFavorites, removeMultipleFavorites } from '~/features/favorites/favoritesService'
import MovieCardWithHover from '~/components/movie/MovieCardWithHover/MovieCardWithHover'
import { FaChevronDown } from 'react-icons/fa'

const cx = classNames.bind(styles)

function Favourite() {
	const [favorites, setFavorites] = useState([])
	const [loading, setLoading] = useState(true)
	const [selectedMovies, setSelectedMovies] = useState([])
	const [sortOption, setSortOption] = useState('dateAdded')
	const [sortDirection, setSortDirection] = useState(false) // false = descending (newest first)
	const [messageApi, contextHolder] = message.useMessage()

	// Fetch favorites
	const fetchFavorites = useCallback(async () => {
		try {
			setLoading(true)
			const sortedFavorites = await getSortedFavorites(sortOption, sortDirection)
			setFavorites(sortedFavorites)
		} catch (error) {
			console.error('Error fetching favorites:', error)
			messageApi.error('Không thể tải danh sách yêu thích.')
		} finally {
			setLoading(false)
		}
	}, [sortOption, sortDirection, messageApi])

	// Initial fetch
	useEffect(() => {
		fetchFavorites()
	}, [fetchFavorites])

	// Toggle selection of a movie
	const toggleSelection = (movieId) => {
		setSelectedMovies((prev) => {
			if (prev.includes(movieId)) {
				return prev.filter((id) => id !== movieId)
			} else {
				return [...prev, movieId]
			}
		})
	}

	// Handle sorting change
	const handleSortChange = (value) => {
		setSortOption(value)
	}

	// Toggle sort direction
	const toggleSortDirection = () => {
		setSortDirection((prev) => !prev)
	}

	// Remove selected favorites
	const removeSelected = async () => {
		if (selectedMovies.length === 0) {
			messageApi.info('Chọn ít nhất một phim để xóa')
			return
		}

		try {
			setLoading(true)
			const result = await removeMultipleFavorites(selectedMovies)

			if (result.success) {
				messageApi.success(`Đã xóa ${selectedMovies.length} phim khỏi danh sách yêu thích`)
				setSelectedMovies([])
				await fetchFavorites()
			} else {
				messageApi.error(result.error || 'Có lỗi xảy ra, vui lòng thử lại sau')
			}
		} catch (error) {
			console.error('Error removing favorites:', error)
			messageApi.error('Có lỗi xảy ra, vui lòng thử lại sau')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className={cx('wrapper')}>
			{contextHolder}
			<div className={cx('favourite-container')}>
				<Flex justify='space-between' align='center' className={cx('header')}>
					<Typography.Title level={3} className={cx('title')}>
						Danh sách yêu thích ({favorites.length})
					</Typography.Title>

					<Space>
						<Select
							className={cx('sort-select')}
							dropdownStyle={{ backgroundColor: '#25272f' }}
							suffixIcon={<FaChevronDown />}
							value={sortOption}
							onChange={handleSortChange}
							style={{ width: 120 }}
							options={[
								{ value: 'dateAdded', label: 'Ngày thêm' },
								{ value: 'name', label: 'Tên phim' },
								{ value: 'year', label: 'Năm sản xuất' },
							]}
						/>
						<Button
							className={cx('sort-btn')}
							icon={<SortAscendingOutlined rotate={sortDirection ? 0 : 180} />}
							onClick={toggleSortDirection}
						/>
						<ConfigProvider theme={{ token: { colorTextDisabled: '#ccc' } }}>
							<Button danger icon={<DeleteOutlined />} onClick={removeSelected} disabled={selectedMovies.length === 0}>
								Xóa ({selectedMovies.length})
							</Button>
						</ConfigProvider>
					</Space>
				</Flex>

				{loading ? (
					<Flex justify='center' align='center' style={{ height: '300px' }}>
						<Spin size='large' />
					</Flex>
				) : favorites.length > 0 ? (
					<Flex wrap gap={20}>
						{favorites.map((movie) => (
							<div
								key={movie._id}
								className={cx('movie-item', { selected: selectedMovies.includes(movie._id) })}
								onClick={() => toggleSelection(movie._id)}>
								<MovieCardWithHover imageUrl='https://img.ophim.live' movieData={movie} direction='vertical' />
								<div className={cx('movie-overlay', { active: selectedMovies.includes(movie._id) })} />
							</div>
						))}
					</Flex>
				) : (
					<Empty className={cx('empty')} description='Chưa có phim yêu thích nào' />
				)}
			</div>
		</div>
	)
}

export default Favourite
