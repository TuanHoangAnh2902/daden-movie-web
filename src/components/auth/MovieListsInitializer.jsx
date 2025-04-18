import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMovieLists, setError, setLoading } from '~/features/movieLists/movieListsSlice'
import { initializeMovieLists } from '~/features/movieLists/movieListsService'
import PropTypes from 'prop-types'

const MovieListsInitializer = ({ children }) => {
	const dispatch = useDispatch()
	const { isAuthenticated, currentUser } = useSelector((state) => state.auth)

	useEffect(() => {
		// If the user is authenticated, initialize their movie lists
		const loadMovieLists = async () => {
			if (isAuthenticated && currentUser?.uid) {
				try {
					dispatch(setLoading(true))
					const { status, data, error } = await initializeMovieLists()

					if (status === 'success' && data.lists) {
						dispatch(setMovieLists(data.lists))
					} else if (error) {
						dispatch(setError(error))
					} else {
						// No movie lists or empty object returned
						dispatch(setMovieLists({}))
					}
				} catch (error) {
					console.error('Error loading movie lists:', error)
					dispatch(setError('Không thể tải danh sách phim.'))
				} finally {
					dispatch(setLoading(false))
				}
			}
		}

		loadMovieLists()
	}, [isAuthenticated, currentUser, dispatch])

	// Return children to render them
	return children
}

MovieListsInitializer.propTypes = {
	children: PropTypes.node,
}

export default MovieListsInitializer
