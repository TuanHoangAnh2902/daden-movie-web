export default function getRandomMovies(arr = [], count) {
	if (!Array.isArray(arr) || arr.length === 0) return [] // Kiểm tra đầu vào

	let shuffled = arr.slice() // Sao chép mảng mà không dùng spread
	for (let i = shuffled.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1)) // Chọn chỉ số ngẫu nhiên
		;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]] // Hoán đổi phần tử
	}
	return shuffled.slice(0, count) // Cắt lấy số lượng phần tử yêu cầu
}
