import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const movieApi = createApi({
	reducerPath: 'movieApi',
	baseQuery: fetchBaseQuery({ baseUrl: 'https://ophim1.com' }),
	endpoints: (builder) => ({
		getMoviesList: builder.query({
			query: (page = 1) => `/danh-sach/phim-moi-cap-nhat?page=${page}`,
		}),
		getMovieInfo: builder.query({
			query: (slug) => `/phim/${slug}`,
		}),
	}),
})

export const { useGetMoviesListQuery, useGetMovieInfoQuery } = movieApi
