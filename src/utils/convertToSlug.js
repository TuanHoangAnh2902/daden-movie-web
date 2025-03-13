export default function convertToSlug(str) {
	return str
		.normalize('NFD') // Chuẩn hóa về dạng NFD (tách dấu khỏi chữ cái)
		.replace(/[\u0300-\u036f]/g, '') // Xóa dấu
		.replace(/\s+/g, '-') // Thay dấu cách bằng gạch ngang
		.toLowerCase() // Chuyển thành chữ thường
}
