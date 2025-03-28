export const getRandomHexColor = () => {
	return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

export const getRandomRGBColor = () => {
	const r = Math.floor(Math.random() * 256)
	const g = Math.floor(Math.random() * 256)
	const b = Math.floor(Math.random() * 256)
	const a = (Math.random() * 0.4 + 0.4).toFixed(2) // Opacity từ 0.40 đến 0.80
	return `rgba(${r}, ${g}, ${b}, ${a})`
}
