import { useEffect, useRef, useState } from 'react'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'
import Hls from 'hls.js'
import PropTypes from 'prop-types'
import styles from './VideoPlayer.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

const VideoPlayer = ({ src }) => {
	const videoRef = useRef(null)
	const playerRef = useRef(null)
	const hlsRef = useRef(null)
	const [isReady, setIsReady] = useState(false)
	const [isInitialized, setIsInitialized] = useState(false)
	const [error, setError] = useState(null)

	// Initialize player only when component has mounted
	useEffect(() => {
		// Only render empty video element initially
		setIsInitialized(true)
		return () => {
			// Clean up player and HLS instance when component unmounts
			if (playerRef.current) {
				playerRef.current.destroy()
			}
			if (hlsRef.current) {
				hlsRef.current.destroy()
			}
		}
	}, []) // Empty dependency array ensures this runs only on mount

	// Setup video source when user interacts or after a delay
	useEffect(() => {
		if (!isInitialized) return

		// Wait for user interaction or a short delay before loading video
		const handleUserInteraction = () => {
			loadVideo()
			// Remove event listeners after video starts loading
			cleanupEventListeners()
		}

		// Function to remove event listeners
		const cleanupEventListeners = () => {
			document.removeEventListener('click', handleUserInteraction)
			document.removeEventListener('keydown', handleUserInteraction)
			document.removeEventListener('touchstart', handleUserInteraction)
		}

		// Add event listeners for user interaction
		document.addEventListener('click', handleUserInteraction)
		document.addEventListener('keydown', handleUserInteraction)
		document.addEventListener('touchstart', handleUserInteraction)

		// Optional: Load video after a delay even without interaction
		const timer = setTimeout(() => {
			loadVideo()
			// Remove event listeners since we're loading the video anyway
			cleanupEventListeners()
		}, 1500) // 1.5 seconds delay

		// Function to load the actual video
		function loadVideo() {
			// Check if video is already being loaded
			if (document.querySelector('.' + cx('video-loading'))) return

			// Reset error state
			setError(null)

			// Create video element dynamically
			const videoElement = document.createElement('video')
			videoElement.className = 'plyr ' + cx('video-loading')
			videoElement.width = '100%'
			videoElement.poster = '/video-placeholder.jpg'

			// Append to container
			const container = document.querySelector('.' + cx('video-container'))
			if (container) {
				// Clear any existing videos - safely check before removing
				const existingVideo = container.querySelector('video')
				if (existingVideo && existingVideo.parentNode === container) {
					container.removeChild(existingVideo)
				} else if (existingVideo) {
					// If video exists but in a different parent, handle carefully
					try {
						existingVideo.parentNode?.removeChild(existingVideo)
					} catch (err) {
						console.warn('Could not remove existing video element:', err)
					}
				}

				// Add new video
				container.appendChild(videoElement)
				videoRef.current = videoElement

				// Initialize player after video element is added
				playerRef.current = new Plyr(videoRef.current, {
					controls: [
						'play',
						'rewind',
						'fast-forward',
						'progress',
						'current-time',
						'mute',
						'volume',
						'settings',
						'fullscreen',
					],
					settings: ['quality', 'speed'],
					ratio: '16:9',
					autoplay: false,
					seekTime: 10, // Thiết lập thời gian tua là 10 giây
				})

				// If browser supports HLS
				if (Hls.isSupported()) {
					const hls = new Hls({
						maxBufferLength: 30,
						maxMaxBufferLength: 60,
					})
					hlsRef.current = hls

					hls.loadSource(src)
					hls.attachMedia(videoRef.current)

					hls.on(Hls.Events.MANIFEST_PARSED, () => {
						setIsReady(true) // Mark player as loaded
						videoElement.classList.remove(cx('video-loading'))

						// Configure quality options if available
						if (hls.levels && hls.levels.length > 0) {
							const levels = hls.levels.map((l) => l.height)
							playerRef.current.quality = {
								default: levels[levels.length - 1], // Set highest quality as default
								options: levels,
								forced: true,
							}

							// When player is ready, attempt to play (needed for mobile)
							const playPromise = videoRef.current.play()
							if (playPromise !== undefined) {
								playPromise.catch(() => {
									// Auto-play was prevented, do nothing (user needs to click play)
								})
							}
						}
					})

					hls.on(Hls.Events.ERROR, (event, data) => {
						if (data.fatal) {
							switch (data.type) {
								case Hls.ErrorTypes.NETWORK_ERROR:
									// Try to recover network error
									console.error('Lỗi mạng khi tải video:', data)
									setError('Đã xảy ra lỗi kết nối. Đang thử lại...')
									hls.startLoad()
									break
								case Hls.ErrorTypes.MEDIA_ERROR:
									// Try to recover media error
									console.error('Lỗi phương tiện khi tải video:', data)
									setError('Đã xảy ra lỗi với video. Đang thử lại...')
									hls.recoverMediaError()
									break
								default:
									// Cannot recover, destroy and recreate HLS instance
									console.error('Lỗi nghiêm trọng khi tải video:', data)
									setError('Không thể phát video này. Vui lòng thử lại sau.')
									hls.destroy()
									break
							}
						}
					})
				} else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
					// For Safari which has built-in HLS support
					videoRef.current.src = src
					videoRef.current.addEventListener('loadedmetadata', () => {
						setIsReady(true)
						videoElement.classList.remove(cx('video-loading'))
					})
					videoRef.current.addEventListener('error', () => {
						setError('Không thể phát video này. Vui lòng thử lại sau.')
					})
				} else {
					// For browsers that don't support HLS
					setError('Trình duyệt của bạn không hỗ trợ video này.')
				}
			}
		}

		return () => {
			clearTimeout(timer)
			cleanupEventListeners()
		}
	}, [src, isInitialized])

	return (
		<div className={cx('video-container')}>
			{!isReady && (
				<div className={cx('video-skeleton')}>
					<div className={cx('video-controls-placeholder')}>
						<div className={cx('control-button')}></div>
						<div className={cx('progress-bar')}></div>
						<div className={cx('volume-control')}></div>
						<div className={cx('fullscreen-button')}></div>
					</div>
				</div>
			)}

			{error && (
				<div className={cx('video-error-message')}>
					<p>{error}</p>
					<button onClick={() => window.location.reload()}>Thử lại</button>
				</div>
			)}
		</div>
	)
}

VideoPlayer.propTypes = {
	src: PropTypes.string.isRequired,
}

export default VideoPlayer
