import { useState } from 'react'
import { Carousel } from 'antd'
import { motion } from 'framer-motion'
import styled from 'styled-components'

// Hiệu ứng khi phần tử mount (chỉ nội dung)
const textVariants = {
	hidden: { opacity: 0, x: 20 },
	visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const CustomCarousel = styled(Carousel)`
	background-color: red;
	& .slick-list {
		color: white;
		& .slick-track {
			& .slick-slide {
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
`

const About = () => {
	const [key, setKey] = useState(0) // Key để reset component mỗi lần render

	return (
		<CustomCarousel
			waitForAnimate
			infinite
			draggable
			effect='fade'
			arrows
			beforeChange={() => setKey((prev) => prev + 1)} // Mỗi lần đổi slide, update key
		>
			{['1', '2', '3', '4'].map((item) => (
				<motion.p
					key={key} // Key mới giúp nội dung mount lại => chạy hiệu ứng
					initial='hidden'
					animate='visible'
					variants={textVariants}
					style={{ fontSize: '24px', fontWeight: 'bold' }}>
					{item}
				</motion.p>
			))}
		</CustomCarousel>
	)
}

export default About
