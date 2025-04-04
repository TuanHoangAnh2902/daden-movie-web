import { useState, useEffect } from 'react'

export const useThemeColors = () => {
	const getColors = () => {
		const rootStyles = getComputedStyle(document.documentElement)
		return {
			bgColorLight: rootStyles.getPropertyValue('--bg-color-layout-light').trim() || '#000',
			textColor: rootStyles.getPropertyValue('--text-color').trim() || '#fff',
			subColor: rootStyles.getPropertyValue('--sub-color').trim() || '#fff',
			cardWidthVertical: rootStyles.getPropertyValue('--card-width-vertical').trim() || '100%',
			cardWidthHorizontal: rootStyles.getPropertyValue('--card-width-horizontal').trim() || '100%',
			cardHeightVertical: rootStyles.getPropertyValue('--card-height-vertical').trim() || '100%',
			cardHeightHorizontal: rootStyles.getPropertyValue('--card-height-horizontal').trim() || '100%',
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
