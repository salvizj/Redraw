import React from 'react'
import PlayersInLobby from './PlayersInLobbyDisplay'
import HandleCopyToClipboard from './HandleCopyToClipboard'
import StartButton from './LobbyStartButton'
import { Player, LobbySettings } from '../types'

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
			<div className="text-center text-lg animate-pulse">
				<p className="mb-2">Connecting to the lobby...</p>
				<p className="mb-2">Gathering user details...</p>
				<p className="mb-2">Almost there...</p>
			</div>
		)
	}

	return (
		<div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
			<p className="text-lg mb-2">Lobby ID: {lobbyId}</p>
			<p className="text-lg mb-2">Username: {username}</p>
			<p className="text-lg mb-4">User Role: {role}</p>

			<p className="text-lg mb-2">
				<strong>Lobby Status:</strong> {lobbySettings.LobbyStatus}
			</p>
			<p className="text-lg mb-2">
				<strong>Max Player Count:</strong>{' '}
				{lobbySettings.MaxPlayerCount}
			</p>
			<p className="text-lg mb-4">
				<strong>Current Player Count:</strong> {playerCount}
			</p>

			<PlayersInLobby players={players} />
			<HandleCopyToClipboard lobbyId={lobbyId} />
			<StartButton handleStart={handleStartGame} role={role} />
		</div>
	)
}

export default LobbyDetails
