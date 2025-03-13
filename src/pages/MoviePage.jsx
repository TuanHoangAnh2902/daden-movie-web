import PropTypes from 'prop-types'

function MoviePage({ title }) {
	return <div>{title}</div>
}

export default MoviePage

MoviePage.propTypes = {
	title: PropTypes.string,
}
