import { Flex } from 'antd'
import styles from './Gallery.module.scss'
import classNames from 'classnames/bind'
import TopicsList from './TopicsList/TopicsList'
import { useGetMoviesByCountryQuery, useGetMoviesByListQuery } from '~/services/ophimApi'

const cx = classNames.bind(styles)
export default function Gallery() {
	const { data: dataVietNam, isLoading: isLoadingVietNam } = useGetMoviesByCountryQuery('viet-nam')
	const { data: dataHanQuoc, isLoading: isLoadingHanQuoc } = useGetMoviesByCountryQuery('han-quoc')
	const { data: dataHoatHinh, isLoading: isLoadingHoatHinh } = useGetMoviesByListQuery('hoat-hinh')

	return (
		<Flex className={cx('gallery')} vertical>
			<TopicsList data={dataVietNam} isLoading={isLoadingVietNam} />
			<TopicsList data={dataHanQuoc} isLoading={isLoadingHanQuoc} />
			<TopicsList data={dataHoatHinh} isLoading={isLoadingHoatHinh} />
		</Flex>
	)
}
