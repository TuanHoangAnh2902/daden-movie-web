import { Input } from 'antd'
import { useState } from 'react'
import { SearchOutlined } from '@ant-design/icons'

import { useLazyGetSearchMovieQuery } from '~/services/ophimApi'
import classNames from 'classnames/bind'

import styles from './MovieSearch.module.scss'
import convertToSlug from '~/utils/convertToSlug'

const cx = classNames.bind(styles)

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
		<Input
			className={cx('search')}
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
