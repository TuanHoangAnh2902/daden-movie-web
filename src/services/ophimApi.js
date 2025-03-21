import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const movieApi = createApi({
	reducerPath: 'movieApi',
	baseQuery: fetchBaseQuery({ baseUrl: 'https://ophim1.com' }),
	endpoints: (builder) => ({
		getMoviesByUpdate: builder.query({
			query: (page = 1) => `/danh-sach/phim-moi-cap-nhat?page=${page}`,
		}),
		getSearchMovie: builder.query({
			query: (slug) => `/v1/api/tim-kiem?keyword=${slug}`,
		}),
		getMoviesHome: builder.query({
			query: () => '/v1/api/home',
			transformResponse: (response) => response?.data,
		}),
		getMovieById: builder.query({
			query: (Id) => `/phim/id/${Id}`,
		}),
		getMoviesByCountry: builder.query({
			query: (country) => `/v1/api/quoc-gia/${country}`,
			transformResponse: (response) => response?.data,
		}),
		getMoviesByList: builder.query({
			query: (list) => `/v1/api/danh-sach/${list}`,
			transformResponse: (response) => response?.data,
		}),
	}),
})

export const {
	useGetMoviesByUpdateQuery,
	useLazyGetSearchMovieQuery,
	useGetMoviesHomeQuery,
	useGetMovieByIdQuery,
	useLazyGetMovieByIdQuery,
	useGetMoviesByCountryQuery,
	useGetMoviesByListQuery,
} = movieApi
