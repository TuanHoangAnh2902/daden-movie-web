import styles from './MovieSearch.module.scss'

import { Input } from 'antd'
import { useState } from 'react'
import classNames from 'classnames/bind'
import { useNavigate } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'

import convertToSlug from '~/utils/convertToSlug'
import { toSearchPath } from '~/utils/routePaths'

const cx = classNames.bind(styles)
const MovieSearch = () => {
	const navigate = useNavigate()

	const [string, setSring] = useState('')

	const handleSearch = () => {
		const slug = convertToSlug(string.trim()) // Xử lý trim trước khi convert
		if (!slug) return // Nếu không có slug hợp lệ, thoát sớm
		if (string) {
			navigate(toSearchPath(slug, 1), { state: { param: string } })
		}
	}

	return (
		<Input
			className={cx('search')}
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
