import React, { useState } from 'react'
import { HandleCopyToClipboardProps } from '../types'

const HandleCopyToClipboard: React.FC<HandleCopyToClipboardProps> = ({
	lobbyId,
}) => {
	const [copied, setCopied] = useState(false)
	const [copyError, setCopyError] = useState<string | null>(null)

	const handleCopy = () => {
		if (lobbyId) {
			const BASE_URL = import.meta.env.VITE_BASE_URL
			const url = `${BASE_URL}/?l=${lobbyId}`

			navigator.clipboard
				.writeText(url)
				.then(() => {
					setCopied(true)
					setTimeout(() => setCopied(false), 2000)
					setCopyError(null)
				})
				.catch(() => {
					setCopyError('Failed to copy the text to clipboard.')
				})
		} else {
			setCopyError('Lobby ID is null.')
		}
	}

	return (
		<div>
			<button onClick={handleCopy}>Copy Lobby URL</button>
			{copied && <p style={{ color: 'green' }}>Copied to clipboard!</p>}
			{copyError && <p style={{ color: 'red' }}>{copyError}</p>}
		</div>
	)
}

export default HandleCopyToClipboard
