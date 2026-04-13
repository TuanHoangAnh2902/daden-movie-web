import { beforeEach, describe, expect, it, vi } from 'vitest'
import { shareContent, shareFacebook, shareTwitter, shareWhatsApp } from './ShareService'

describe('ShareService popup security', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		window.gtag = undefined
	})

	it('opens Facebook share window with noopener/noreferrer and nulls opener', () => {
		const popup = { opener: {} }
		const openSpy = vi.spyOn(window, 'open').mockReturnValue(popup)

		shareFacebook({ url: 'https://example.com/movie?id=1', title: 'Movie A' })

		expect(openSpy).toHaveBeenCalledTimes(1)
		const [url, title, features] = openSpy.mock.calls[0]
		expect(url).toContain('https://www.facebook.com/sharer/sharer.php?u=')
		expect(url).toContain(encodeURIComponent('https://example.com/movie?id=1'))
		expect(title).toBe('Chia sẻ lên Facebook')
		expect(features).toContain('noopener')
		expect(features).toContain('noreferrer')
		expect(popup.opener).toBeNull()
	})

	it('opens Twitter share window with encoded text and secure features', () => {
		const popup = { opener: {} }
		const openSpy = vi.spyOn(window, 'open').mockReturnValue(popup)

		shareTwitter({
			url: 'https://example.com/movie?id=2',
			title: 'Movie B',
			description: 'Great film',
		})

		const [url, title, features] = openSpy.mock.calls[0]
		expect(url).toContain('https://twitter.com/intent/tweet?url=')
		expect(url).toContain(encodeURIComponent('https://example.com/movie?id=2'))
		expect(url).toContain(encodeURIComponent('Movie B - Great film'))
		expect(title).toBe('Chia sẻ lên Twitter')
		expect(features).toContain('noopener')
		expect(features).toContain('noreferrer')
		expect(popup.opener).toBeNull()
	})

	it('opens WhatsApp share in a safe new window', () => {
		const popup = { opener: {} }
		const openSpy = vi.spyOn(window, 'open').mockReturnValue(popup)

		shareWhatsApp({ url: 'https://example.com', title: 'Movie C', description: 'Watch now' })

		const [url, target, features] = openSpy.mock.calls[0]
		expect(url).toContain('https://api.whatsapp.com/send?text=')
		expect(target).toBe('_blank')
		expect(features).toContain('noopener')
		expect(features).toContain('noreferrer')
		expect(popup.opener).toBeNull()
	})

	it('tracks gtag event when available', () => {
		window.gtag = vi.fn()
		vi.spyOn(window, 'open').mockReturnValue({ opener: {} })

		shareFacebook({ url: 'https://example.com', title: 'Movie D' })

		expect(window.gtag).toHaveBeenCalledWith('event', 'share', {
			method: 'facebook',
			content_type: 'movie',
			content_id: 'Movie D',
		})
	})
})

describe('shareContent', () => {
	it('uses Web Share API when available', async () => {
		const shareMock = vi.fn().mockResolvedValue(undefined)
		Object.defineProperty(navigator, 'share', {
			value: shareMock,
			configurable: true,
		})

		const result = await shareContent({
			platform: 'facebook',
			url: 'https://example.com',
			title: 'Movie E',
			description: 'Desc',
		})

		expect(result).toBe(true)
		expect(shareMock).toHaveBeenCalledWith({
			title: 'Movie E',
			text: 'Desc',
			url: 'https://example.com',
		})
	})

	it('falls back to platform sharing when Web Share API rejects', async () => {
		const shareMock = vi.fn().mockRejectedValue(new Error('Share canceled'))
		const openSpy = vi.spyOn(window, 'open').mockReturnValue({ opener: {} })
		Object.defineProperty(navigator, 'share', {
			value: shareMock,
			configurable: true,
		})

		const result = await shareContent({
			platform: 'twitter',
			url: 'https://example.com',
			title: 'Movie F',
			description: 'Desc',
		})

		expect(result).toBe(true)
		expect(openSpy).toHaveBeenCalledTimes(1)
	})

	it('returns false for unsupported platform', async () => {
		Object.defineProperty(navigator, 'share', {
			value: undefined,
			configurable: true,
		})

		const result = await shareContent({
			platform: 'telegram',
			url: 'https://example.com',
			title: 'Movie G',
			description: 'Desc',
		})

		expect(result).toBe(false)
	})
})
