import { useState } from 'react'
import { Input } from 'antd'
import { useLazyGetSearchMovieQuery } from '~/services/ophimApi'
import styled from 'styled-components'
import { SearchOutlined } from '@ant-design/icons'
import convertToSlug from '~/utils/convertToSlug'

const StyledInput = styled(Input)`
	background-color: hsla(0, 0%, 100%, 0.08);
	border: none;
	padding: 12px 18px;

	& .ant-input-suffix {
		& .ant-input-clear-icon {
			color: #fff;
			opacity: 0.7;
			font-size: 16px;
		}
	}
	& .ant-input-prefix {
		color: #fff;
		font-size: 18px;
		opacity: 0.7;
		margin-right: 10px;
	}
	&:hover,
	&:focus {
		background-color: hsla(0, 0%, 100%, 0.1);
		outline: 1px solid #b8b8b8;
	}
	&:not(:focus) {
		color: #fff;
		opacity: 0.7;
		background-color: hsla(0, 0%, 100%, 0.08);
	}
	input {
		color: #fff;
		&::placeholder {
			color: #fff;
			opacity: 0.7;
		}
	}
`

const MovieSearch = () => {
	const [string, setSring] = useState('')
	const [fetchMovie, { data, error, isLoading }] = useLazyGetSearchMovieQuery() // 🟢 useLazyQuery
	console.log('🚀 ~ MovieSearch ~ data:', data)

	const handleSearch = () => {
		const slug = convertToSlug(string)
		if (string) {
			fetchMovie(slug) // 🟢 Gọi API khi người dùng nhấn nút
		}
	}

	return (
		<StyledInput
			disabled={isLoading}
			allowClear
			prefix={<SearchOutlined />}
			placeholder='Tìm kiếm phim'
			value={string}
			onChange={(e) => setSring(e.target.value)}
			onPressEnter={handleSearch}
		/>
	)
}

export default MovieSearch
