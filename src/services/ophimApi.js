import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const { VITE_API_ENDPOINT } = import.meta.env

// Constants for caching
const CACHE_TIME = 60 * 5 // 5 minutes in seconds
const HOME_CACHE_TIME = 60 * 15 // 15 minutes for home data

export const movieApi = createApi({
	reducerPath: 'movieApi',
	baseQuery: fetchBaseQuery({
		baseUrl: VITE_API_ENDPOINT,
		timeout: 10000, // 10 seconds timeout
		prepareHeaders: (headers) => {
			headers.set('Cache-Control', 'max-age=300') // Browser caching - 5 minutes
			return headers
		},
	}),
	tagTypes: ['Movies'],
	keepUnusedDataFor: CACHE_TIME,
	refetchOnMountOrArgChange: false,
	refetchOnFocus: false,
	refetchOnReconnect: true,
	endpoints: (builder) => ({
		getMoviesByUpdate: builder.query({
			query: (page = 1) => `/danh-sach/phim-moi-cap-nhat?page=${page}`,
			keepUnusedDataFor: CACHE_TIME,
		}),
		getSearchMovie: builder.query({
			query: ({ slug, page = 1 }) => `/v1/api/tim-kiem?keyword=${slug}&page=${page}`,
			transformResponse: (response) => response?.data,
			keepUnusedDataFor: 60, // 1 minute for search results
		}),
		getMoviesHome: builder.query({
			query: () => '/v1/api/home',
			transformResponse: (response) => response?.data,
			keepUnusedDataFor: HOME_CACHE_TIME,
		}),
		getMovieById: builder.query({
			query: (Id) => `/phim/id/${Id}`,
			keepUnusedDataFor: CACHE_TIME,
		}),
		getMoviesByCountry: builder.query({
			query: ({ country, page = 1 }) => `/v1/api/quoc-gia/${country}?page=${page}`,
			transformResponse: (response) => response?.data,
			keepUnusedDataFor: CACHE_TIME,
		}),
		getMoviesByList: builder.query({
			query: ({ list, page = 1 }) => `/v1/api/danh-sach/${list}?page=${page}`,
			transformResponse: (response) => response?.data,
			keepUnusedDataFor: CACHE_TIME,
		}),
		getMoviesByCategory: builder.query({
			query: ({ category, page = 1 }) => `/v1/api/the-loai/${category}?page=${page}`,
			transformResponse: (response) => response?.data,
			keepUnusedDataFor: CACHE_TIME,
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
	useLazyGetMoviesByListQuery,
	useLazyGetMoviesByCountryQuery,
	useGetMoviesByListQuery,
	useLazyGetMoviesByCategoryQuery,
} = movieApi
