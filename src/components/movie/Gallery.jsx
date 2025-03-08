import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const images = [
	{
		id: '1',
		src: 'https://plus.unsplash.com/premium_photo-1734543942836-3f9a0c313da4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	},
	{
		id: '2',
		src: 'https://images.unsplash.com/photo-1740680209909-d43c99265d3b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	},
	{
		id: '3',
		src: 'https://images.unsplash.com/photo-1740680209886-c461a9c692f3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	},
]

export default function Gallery() {
	const [selectedId, setSelectedId] = useState(null)

	return (
		<div className='grid grid-cols-3 gap-4 p-4'>
			{images.map((img) => (
				<motion.img
					key={img.id}
					src={img.src}
					layoutId={img.id} // Dùng layoutId để liên kết với trang detail
					className='cursor-pointer rounded-lg'
					onClick={() => setSelectedId(img.id)}
					whileHover={{ scale: 1.1 }}
				/>
			))}

			<AnimatePresence>
				{selectedId && (
					<motion.div
						className='fixed inset-0 flex items-center justify-center bg-black/50'
						onClick={() => setSelectedId(null)}>
						<motion.img
							src={images.find((img) => img.id === selectedId)?.src}
							layoutId={selectedId} // Dùng cùng layoutId để tạo hiệu ứng zoom
							className='max-w-[90%] max-h-[90%] rounded-lg'
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
