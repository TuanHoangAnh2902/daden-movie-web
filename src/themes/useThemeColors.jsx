import { useState, useEffect } from 'react'

export const useThemeColors = () => {
	const getColors = () => {
		const rootStyles = getComputedStyle(document.documentElement)
		return {
			bgColorLight: rootStyles.getPropertyValue('--bg-color-layout-light').trim() || '#000',
			textColor: rootStyles.getPropertyValue('--text-color').trim() || '#fff',
		}
	}

	const [colors, setColors] = useState(getColors)

	useEffect(() => {
		const observer = new MutationObserver(() => {
			setColors(getColors())
		})

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['style'],
		})

		return () => observer.disconnect()
	}, [])

	return colors
}
