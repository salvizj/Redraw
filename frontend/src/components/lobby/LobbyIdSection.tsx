import React from "react"
import HandleCopyToClipboard from "../HandleCopyToClipboard"

interface LobbyIdSectionProps {
	lobbyId: string
}

const LobbyIdSection: React.FC<LobbyIdSectionProps> = ({ lobbyId }) => (
	<div className="flex flex-col items-center justify-center pt-10">
		<h1 className="text-primary-light dark:text-primary-dark text-4xl font-bold mb-4">
			Invite Friends by Sharing Your Lobby Link!
		</h1>
		<p className="font-semibold text-text-light dark:text-text-dark text-xl">
			Lobby ID: {lobbyId}
		</p>
		<HandleCopyToClipboard lobbyId={lobbyId} />
	</div>
)

export default LobbyIdSection
