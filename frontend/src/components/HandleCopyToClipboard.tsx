import React, { useState } from "react"

type HandleCopyToClipboardProps = {
	lobbyId: string | null
}

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
					setCopyError("Failed to copy the text to clipboard.")
				})
		} else {
			setCopyError("Lobby ID is null.")
		}
	}

	return (
		<div className="mt-4">
			<button
				onClick={handleCopy}
				className="bg-button-active text-white py-2 px-4 rounded-lg shadow-md hover:bg-button-hover transition"
			>
				Copy Lobby URL
			</button>
			{copied && (
				<p className="text-success mt-2">Copied to clipboard!</p>
			)}
			{copyError && <p className="text-error mt-2">{copyError}</p>}
		</div>
	)
}

export default HandleCopyToClipboard
