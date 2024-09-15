import React from "react"
import HandleCopyToClipboard from "../HandleCopyToClipboard"

interface LobbyIdSectionProps {
	lobbyId: string
}

const LobbyIdSection: React.FC<LobbyIdSectionProps> = ({ lobbyId }) => (
	<div className="mb-4">
		<p className="font-semibold text-text-light dark:text-text-dark text-xl">
			Lobby ID:
		</p>
		<p className="ml-2 text-text-light dark:text-text-dark text-xl">
			{lobbyId}
		</p>
		<HandleCopyToClipboard lobbyId={lobbyId} />
	</div>
)

export default LobbyIdSection
