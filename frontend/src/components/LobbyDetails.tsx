import React from 'react'
import PlayersInLobby from './PlayersInLobby'
import HandleCopyToClipboard from './HandleCopyToClipboard'
import StartButton from './StartButton'
import { Player } from '../types'

type LobbyDetailsProps = {
	lobbyId: string
	username: string
	role: string
	players: Player[]
	handleStartGame: () => void
	loading: boolean
}

const LobbyDetails: React.FC<LobbyDetailsProps> = ({
	lobbyId,
	username,
	role,
	players,
	handleStartGame,
	loading,
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
			<PlayersInLobby players={players} />
			<HandleCopyToClipboard lobbyId={lobbyId} />
			<StartButton handleStart={handleStartGame} role={role} />
		</div>
	)
}

export default LobbyDetails
