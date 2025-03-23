import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'

function Portal({ children }) {
	const [container] = useState(() => document.createElement('div'))

	useEffect(() => {
		document.body.appendChild(container)
		return () => {
			document.body.removeChild(container)
		}
	}, [container])

	return createPortal(children, container)
}

Portal.propTypes = {
	children: PropTypes.node.isRequired,
}

export default Portal
