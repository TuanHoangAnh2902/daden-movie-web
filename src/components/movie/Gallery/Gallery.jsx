import { Flex } from 'antd'
import styles from './Gallery.module.scss'
import classNames from 'classnames/bind'
import TopicsList from './TopicsList/TopicsList'
import { useGetMoviesByCountryQuery, useGetMoviesByListQuery } from '~/services/ophimApi'

const cx = classNames.bind(styles)
export default function Gallery() {
	const { data: dataVietNam, isLoading: isLoadingVietNam } = useGetMoviesByCountryQuery({
		country: 'viet-nam',
		page: 1,
	})
	const { data: dataHanQuoc, isLoading: isLoadingHanQuoc } = useGetMoviesByCountryQuery({
		country: 'nhat-ban',
		page: 1,
	})
	const { data: dataHoatHinh, isLoading: isLoadingHoatHinh } = useGetMoviesByListQuery({ list: 'hoat-hinh' })

	return (
		<Flex className={cx('gallery')} vertical>
			<TopicsList data={dataVietNam} isLoading={isLoadingVietNam} />
			<TopicsList data={dataHanQuoc} isLoading={isLoadingHanQuoc} />
			<TopicsList data={dataHoatHinh} isLoading={isLoadingHoatHinh} />
		</Flex>
	)
}
