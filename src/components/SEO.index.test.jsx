import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import SEO from './SEO.index'

let container = null
let root = null

function renderSeo({ route, props }) {
	container = document.createElement('div')
	document.body.appendChild(container)
	root = createRoot(container)

	act(() => {
		root.render(
			<HelmetProvider>
				<MemoryRouter initialEntries={[route]}>
					<SEO {...props} />
				</MemoryRouter>
			</HelmetProvider>,
		)
	})

	return document.head.innerHTML
}

afterEach(() => {
	if (root) {
		act(() => {
			root.unmount()
		})
	}

	if (container?.parentNode) {
		container.parentNode.removeChild(container)
	}

	container = null
	root = null
	document.head.innerHTML = ''
})

describe('SEO component', () => {
	it('includes pathname and query in canonical and og:url', () => {
		const headHtml = renderSeo({
			route: '/search/one-piece?page=3',
			props: {
				title: 'Tim kiem One Piece',
				description: 'Ket qua tim kiem',
			},
		})

		expect(headHtml).toContain('href="https://daden-movie-web.vercel.app/search/one-piece?page=3"')
		expect(headHtml).toContain('property="og:url" content="https://daden-movie-web.vercel.app/search/one-piece?page=3"')
	})

	it('uses noindex robots meta when requested', () => {
		const headHtml = renderSeo({
			route: '/not-found',
			props: {
				title: '404',
				noIndex: true,
			},
		})

		expect(headHtml).toContain('name="robots" content="noindex, nofollow"')
	})

	it('builds absolute og:image for relative image input', () => {
		const headHtml = renderSeo({
			route: '/movie/abc',
			props: {
				title: 'Movie',
				image: '/poster.jpg',
			},
		})

		expect(headHtml).toContain('property="og:image" content="https://daden-movie-web.vercel.app/poster.jpg"')
	})
})
