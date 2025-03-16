const removeTagsUsingDOM = (html) => {
	if (typeof html !== 'string') return '' // Tránh lỗi khi html là object hoặc null/undefined
	const doc = new DOMParser().parseFromString(html, 'text/html')
	return doc.body.textContent || ''
}

export default removeTagsUsingDOM
