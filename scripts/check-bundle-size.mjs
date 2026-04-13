import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const DIST_ASSETS_DIR = join(process.cwd(), 'dist', 'assets')

const bytesToKb = (bytes) => Number((bytes / 1024).toFixed(2))

const jsFiles = readdirSync(DIST_ASSETS_DIR).filter((fileName) => fileName.endsWith('.js'))

const budgetsKb = {
	'index-': 80,
	'react-core-': 220,
	'redux-': 70,
	'share-': 20,
	'ui-motion-': 240,
	'vendor-': 500,
	'antd-': 550,
	'firebase-': 620,
	'media-': 780,
}

const failures = []

for (const [chunkPrefix, maxKb] of Object.entries(budgetsKb)) {
	const matched = jsFiles.find((fileName) => fileName.startsWith(chunkPrefix))

	if (!matched) {
		failures.push(`Missing expected chunk: ${chunkPrefix}*.js`)
		continue
	}

	const fullPath = join(DIST_ASSETS_DIR, matched)
	const chunkSizeKb = bytesToKb(statSync(fullPath).size)

	if (chunkSizeKb > maxKb) {
		failures.push(`Chunk ${matched} is ${chunkSizeKb} kB (budget ${maxKb} kB)`)
	}
}

if (failures.length > 0) {
	console.error('Bundle size budget check failed:')
	for (const failure of failures) {
		console.error(`- ${failure}`)
	}
	process.exit(1)
}

console.log('Bundle size budget check passed.')
