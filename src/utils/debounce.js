/**
 * Tạo một debounced function để hạn chế tần suất gọi function
 *
 * @param {Function} func - Function cần debounce
 * @param {number} wait - Thời gian chờ tính bằng milliseconds
 * @param {Object} options - Tùy chọn bổ sung
 * @param {boolean} options.leading - Có gọi lần đầu tiên ngay lập tức không
 * @param {boolean} options.trailing - Có gọi lần cuối cùng sau khi kết thúc không
 * @returns {Function} - Function đã được debounce
 */
export function debounce(func, wait = 300, options = {}) {
  let timeoutId = null;
  const { leading = false, trailing = true } = options;

  return function (...args) {
    const context = this;
    const invokeLeading = leading && !timeoutId;

    const later = () => {
      timeoutId = null;
      if (trailing) func.apply(context, args);
    };

    clearTimeout(timeoutId);
    timeoutId = setTimeout(later, wait);

    if (invokeLeading) func.apply(context, args);
  };
}
