import { Dropdown, Flex, Space } from 'antd'

import MovieSearch from '../movie/MovieSearch'
import Logo from '~/assets/Logo'
import styled from 'styled-components'
import { moviesCategories } from '~/constants/routes'
import { Link } from 'react-router-dom'
import { CaretDownOutlined } from '@ant-design/icons'

const StyledFlex = styled(Flex)`
	& .nav-child {
		color: #fff;
		font-size: 16px;
		opacity: 0.7;
		cursor: pointer;
		&:hover {
			opacity: 1;
		}
		&:visited {
			color: #fff;
		}
	}
`

const StyledWrapper = styled(Flex)`
	background: transparent;
	padding: 14px 20px;
	position: fixed;
	top: 0;
	width: 100%;
	z-index: 1000;
`

function MovieTopNav() {
	return (
		<StyledWrapper align='center' justify='space-around'>
			<Flex align='center' gap={14}>
				<Link to='/'>
					<Logo width={50} height={50} />
				</Link>
				<MovieSearch />
			</Flex>
			<Flex align='center' gap={20}>
				{moviesCategories.map((category, index) => (
					<StyledFlex key={index} align='center'>
						{category.children ? (
							<Dropdown
								arrow
								className='nav-child'
								menu={{
									items: category.children.map((child) => ({
										key: child.to, // Đặt key là đường dẫn
										label: <Link to={child.to}>{child.name}</Link>, // Hiển thị tên phim
									})),
								}}
								trigger={['click']}>
								<Space>
									{category.name}
									<CaretDownOutlined />
								</Space>
							</Dropdown>
						) : (
							<Link className='nav-child' to={category.to}>
								{category.name}
							</Link>
						)}
					</StyledFlex>
				))}
			</Flex>
		</StyledWrapper>
	)
}

export default MovieTopNav
