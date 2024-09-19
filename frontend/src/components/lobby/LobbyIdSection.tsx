import React from "react"
import HandleCopyToClipboard from "../HandleCopyToClipboard"
import { useLanguage } from "../../context/languageContext" // Import the language hook

interface LobbyIdSectionProps {
	lobbyId: string
}

const LobbyIdSection: React.FC<LobbyIdSectionProps> = ({ lobbyId }) => {
	const { language } = useLanguage()

	return (
		<div className="flex flex-col items-center justify-center pt-10">
			<h1 className="text-primary-light dark:text-primary-dark text-4xl font-bold mb-4">
				{language === "en"
					? "Invite Friends by Sharing Your Lobby Link!"
					: "Aicini draugus, daloties ar savu istabas saiti!"}
			</h1>
			<p className="font-semibold text-text-light dark:text-text-dark text-xl">
				{language === "en" ? "Lobby ID:" : "Istabas ID:"} {lobbyId}
			</p>
			<HandleCopyToClipboard lobbyId={lobbyId} />
		</div>
	)
}

export default LobbyIdSection
