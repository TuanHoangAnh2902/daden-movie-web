const encodeSegment = (value = '') => encodeURIComponent(String(value).trim())

export const toMovieDetailPath = (movieId) => `/movie/${encodeSegment(movieId)}`

export const toMovieWatchPath = (movieId, episodeSlug = 'full') => {
	const safeEpisodeSlug = (episodeSlug || 'full').toLowerCase()
	return `/watch/${encodeSegment(movieId)}/${encodeSegment(safeEpisodeSlug)}`
}

export const toSearchPath = (query, page = 1) => `/search/${encodeSegment(query)}?page=${page}`

export const toMovieListPath = (listSlug, page = 1) => `/movies/list/${encodeSegment(listSlug)}?page=${page}`

export const toMovieCategoryPath = (categorySlug, page = 1) => `/movies/category/${encodeSegment(categorySlug)}?page=${page}`

export const toMovieCountryPath = (countrySlug, page = 1) => `/movies/country/${encodeSegment(countrySlug)}?page=${page}`
