import React from "react"
import PlayersInLobby from "./PlayersInLobbyDisplay"
import HandleCopyToClipboard from "./HandleCopyToClipboard"
import StartButton from "./LobbyStartButton"
import { Player, LobbySettings } from "../types"

type LobbyDetailsProps = {
	lobbyId: string
	username: string
	role: string
	players: Player[]
	handleStartGame: () => void
	loading: boolean
	lobbySettings: LobbySettings
	playerCount: number
}

const LobbyDetails: React.FC<LobbyDetailsProps> = ({
	lobbyId,
	username,
	role,
	players,
	handleStartGame,
	loading,
	lobbySettings,
	playerCount,
}) => {
	if (loading) {
		return (
			<div className="card">
				<p className="loading-text">Connecting to the lobby...</p>
				<p className="loading-text">Gathering user details...</p>
				<p className="loading-text">Almost there...</p>
			</div>
		)
	}

	return (
		<div className="card">
			<h2 className="section-title">Lobby Details</h2>
			<div className="detail-item">
				<span className="detail-label">Lobby ID:</span>
				<span className="detail-value">{lobbyId}</span>
				<HandleCopyToClipboard lobbyId={lobbyId} />
			</div>
			<p className="detail-item">
				<span className="detail-label">Username:</span>
				<span className="detail-value">{username}</span>
			</p>
			<p className="detail-item">
				<span className="detail-label">User Role:</span>
				<span className="detail-value">{role}</span>
			</p>
			<p className="detail-item">
				<span className="detail-label">Lobby Status:</span>
				<span className="detail-value">
					{lobbySettings.LobbyStatus}
				</span>
			</p>
			<p className="detail-item">
				<span className="detail-label">Max Player Count:</span>
				<span className="detail-value">
					{lobbySettings.MaxPlayerCount}
				</span>
			</p>
			<p className="detail-item">
				<span className="detail-label">Current Player Count:</span>
				<span className="detail-value">{playerCount}</span>
			</p>
			<PlayersInLobby players={players} />
			{role === "leader" && (
				<div className="button-container">
					<StartButton handleStart={handleStartGame} role={role} />
				</div>
			)}
		</div>
	)
}

export default LobbyDetails
