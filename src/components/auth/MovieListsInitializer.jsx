import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMovieLists } from '~/features/movieLists/movieListsSlice'
import { initializeMovieLists } from '~/features/movieLists/movieListsService'
import PropTypes from 'prop-types'
import { message } from 'antd'

const MovieListsInitializer = ({ children }) => {
	const dispatch = useDispatch()
	const { isAuthenticated, currentUser } = useSelector((state) => state.auth)
	const [loading, setLoading] = useState(false)
	const [messageApi, contextHolder] = message.useMessage()

	useEffect(() => {
		// If the user is authenticated, initialize their movie lists
		const loadMovieLists = async () => {
			if (isAuthenticated && currentUser?.uid) {
				try {
					setLoading(true)
					const { status, data, error } = await initializeMovieLists()

					if (status === 'success' && data.lists) {
						dispatch(setMovieLists(data.lists))
					} else if (error) {
						messageApi.error('Không thể tải danh sách phim: ' + error)
					} else {
						// No movie lists or empty object returned
						dispatch(setMovieLists({}))
					}
				} catch (error) {
					console.error('Error loading movie lists:', error)
					messageApi.error('Không thể tải danh sách phim.')
				} finally {
					setLoading(false)
				}
			}
		}

		loadMovieLists()
	}, [isAuthenticated, currentUser, dispatch, messageApi])

	// Return children with message context
	return (
		<>
			{contextHolder}
			{loading ? null : children}
		</>
	)
}

MovieListsInitializer.propTypes = {
	children: PropTypes.node,
}

export default MovieListsInitializer
