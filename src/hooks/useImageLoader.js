import { useEffect, useState, useRef, useCallback } from 'react'

// Image cache để tránh tải lại những hình đã load
const imageCache = new Map()

// Hook tùy chỉnh để tải ảnh với tối ưu hóa
const useImageLoader = (src, placeholderSrc = '', options = {}) => {
	const [imageState, setImageState] = useState({
		isLoading: true,
		error: null,
		imageSrc: placeholderSrc || '',
	})

	const observerRef = useRef(null)
	const imageRef = useRef(null)
	const elementRef = useRef(null)
	const hasStartedLoadingRef = useRef(false) // Thêm ref để theo dõi trạng thái đã bắt đầu tải

	// Options mặc định cho IntersectionObserver
	const defaultOptions = {
		threshold: 0.1,
		rootMargin: '100px',
		useIntersectionObserver: true,
		...options,
	}

	// Chức năng tải hình ảnh được tách ra để tái sử dụng
	const loadImage = useCallback(
		(imgSrc) => {
			// Ngăn chặn loadImage chạy nhiều lần cho cùng một URL
			if (hasStartedLoadingRef.current && imgSrc === src) return
			hasStartedLoadingRef.current = true

			// Nếu không có URL, trả về lỗi
			if (!imgSrc) {
				setImageState({
					isLoading: false,
					error: new Error('Không có URL hình ảnh được cung cấp'),
					imageSrc: placeholderSrc,
				})
				return
			}

			// Kiểm tra xem ảnh đã được cache chưa
			if (imageCache.has(imgSrc)) {
				setImageState({
					isLoading: false,
					error: null,
					imageSrc: imgSrc,
				})
				return
			}

			// Tạo một hình ảnh mới để tải
			const img = new Image()
			imageRef.current = img

			img.onload = () => {
				imageCache.set(imgSrc, true)
				setImageState({
					isLoading: false,
					error: null,
					imageSrc: imgSrc,
				})
			}

			img.onerror = (error) => {
				console.error(`Lỗi khi tải hình ảnh từ: ${imgSrc}`, error)
				setImageState({
					isLoading: false,
					error: new Error(`Không thể tải hình ảnh từ: ${imgSrc}`),
					imageSrc: placeholderSrc,
				})
			}

			// Bắt đầu tải hình ảnh
			img.src = imgSrc
		},
		[placeholderSrc, src],
	)

	// Callback để gắn vào DOM element
	const setRef = useCallback(
		(node) => {
			// Nếu node không thay đổi, không làm gì cả để tránh vòng lặp
			if (node === elementRef.current) return

			elementRef.current = node

			if (node && defaultOptions.useIntersectionObserver && 'IntersectionObserver' in window) {
				// Khởi tạo IntersectionObserver nếu element đã được gắn vào DOM
				if (observerRef.current) {
					observerRef.current.disconnect()
				}

				observerRef.current = new IntersectionObserver(
					(entries) => {
						if (entries[0].isIntersecting) {
							loadImage(src)
							observerRef.current.disconnect()
						}
					},
					{
						threshold: defaultOptions.threshold,
						rootMargin: defaultOptions.rootMargin,
					},
				)

				observerRef.current.observe(node)
			} else if (node && (!defaultOptions.useIntersectionObserver || !('IntersectionObserver' in window))) {
				// Tải ngay nếu không sử dụng IntersectionObserver
				loadImage(src)
			}
		},
		[src, defaultOptions.useIntersectionObserver, defaultOptions.threshold, defaultOptions.rootMargin, loadImage],
	)

	// Theo dõi thay đổi src và placeholderSrc
	useEffect(() => {
		// Reset hasStartedLoadingRef khi src thay đổi
		hasStartedLoadingRef.current = false

		// Reset state khi src thay đổi
		setImageState({
			isLoading: true,
			error: null,
			imageSrc: placeholderSrc,
		})

		// Nếu không sử dụng IntersectionObserver hoặc không có hỗ trợ, tải ngay
		if (!defaultOptions.useIntersectionObserver || !('IntersectionObserver' in window)) {
			loadImage(src)
		} else if (elementRef.current) {
			// Nếu element đã được gắn vào DOM, khởi tạo lại observer
			// Thay vì gọi trực tiếp setRef, chỉ thiết lập observer và gọi loadImage nếu cần
			if (observerRef.current) {
				observerRef.current.disconnect()
			}

			observerRef.current = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						loadImage(src)
						observerRef.current.disconnect()
					}
				},
				{
					threshold: defaultOptions.threshold,
					rootMargin: defaultOptions.rootMargin,
				},
			)

			observerRef.current.observe(elementRef.current)
		}

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect()
			}
		}
	}, [
		src,
		placeholderSrc,
		loadImage,
		defaultOptions.useIntersectionObserver,
		defaultOptions.threshold,
		defaultOptions.rootMargin,
	])

	return {
		...imageState,
		ref: setRef,
		imageRef,
	}
}

export default useImageLoader
