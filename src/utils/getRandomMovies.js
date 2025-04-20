import memoize from './memoize'

// Lấy ngẫu nhiên một số lượng phim từ mảng đã cho
// Được tối ưu với memoization để tránh xáo trộn lại khi không cần thiết
function getRandomMoviesInternal(arr = [], count) {
	if (!Array.isArray(arr) || arr.length === 0) return [] // Kiểm tra đầu vào
	if (count >= arr.length) return arr.slice() // Trả về bản sao nếu yêu cầu nhiều hơn hoặc bằng số phần tử

	let shuffled = arr.slice() // Sao chép mảng để không thay đổi mảng gốc

	// Fisher-Yates shuffle algorithm - hiệu quả hơn
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1)) // Chọn chỉ số ngẫu nhiên
		;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]] // Hoán đổi phần tử
	}

	return shuffled.slice(0, count) // Cắt lấy số lượng phần tử yêu cầu
}

// Tạo phiên bản memoized của hàm để tối ưu hiệu suất
// Tùy chỉnh hàm tạo khóa để cân nhắc cả arr.length và count
const getRandomMovies = memoize(
	getRandomMoviesInternal,
	(arr = [], count, cacheKey = '') => {
		// Tạo khóa cache dựa trên length của mảng, count và cacheKey tùy chọn
		// Phương pháp này tránh stringifying toàn bộ array (có thể rất lớn)
		return `${arr.length}-${count}-${cacheKey || ''}`
	},
	{ maxCacheSize: 20 }, // Giới hạn số lượng kết quả lưu trong cache
)

export default getRandomMovies
