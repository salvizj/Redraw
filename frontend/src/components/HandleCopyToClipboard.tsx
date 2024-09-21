import React, { useState } from "react"
import { useLanguage } from "../context/languageContext"
type HandleCopyToClipboardProps = {
	lobbyId: string | null
}

const HandleCopyToClipboard: React.FC<HandleCopyToClipboardProps> = ({
	lobbyId,
}) => {
	const [copied, setCopied] = useState(false)
	const [copyError, setCopyError] = useState<string | null>(null)
	const { language } = useLanguage()
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
					setCopyError(
						language === "en"
							? "Failed to copy the text to clipboard."
							: "Neizdevās kopēt tekstu starpliktuvē "
					)
				})
		} else {
			setCopyError(
				language === "en" ? "Lobby ID is null." : "Istabas ID ir null"
			)
		}
	}

	return (
		<div className="bg-background-light dark:bg-background-dark p-4 rounded-lg  text-center">
			<button
				onClick={handleCopy}
				className="bg-primary-light dark:bg-primary-dark text-white px-4 py-2 rounded-full font-bold transition-colors duration-300 hover:bg-primary-dark dark:hover:bg-primary-light"
			>
				Copy Lobby URL
			</button>
			{copied && (
				<p className="text-green-500 mt-2">
					{language === "en"
						? "Copied to clipboard!"
						: "Kopēts starpliktuvē!"}
				</p>
			)}
			{copyError && <p className="text-red-500 mt-2">{copyError}</p>}
		</div>
	)
}

export default HandleCopyToClipboard
