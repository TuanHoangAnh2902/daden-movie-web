import { Button, ConfigProvider } from 'antd'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import { memo } from 'react'
import { FaPlay } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { buttonTheme } from '~/themes/buttonTheme'
import styles from '../CarouselMovies.module.scss'

const cx = classNames.bind(styles)

const PlayButton = ({ movieId, type }) => (
	<ConfigProvider theme={{ components: { Button: buttonTheme } }}>
		<Link to={`movie/watch?id=${movieId}&ep=${type === 'single' ? 'full' : '1'}`}>
			<Button className={cx('play-btn')} shape='circle' icon={<FaPlay />} />
		</Link>
	</ConfigProvider>
)

PlayButton.propTypes = {
	movieId: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
}

PlayButton.displayName = 'PlayButton'

export default memo(PlayButton)
