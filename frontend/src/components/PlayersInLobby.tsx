import React from 'react'
import { Player } from '../types'

interface PlayersInLobbyProps {
	players: Player[]
}

const PlayersInLobby: React.FC<PlayersInLobbyProps> = ({ players }) => {
	return (
		<div>
			<h2>Players in Lobby:</h2>
			{players.length > 0 ? (
				<ul>
					{players.map((player) => (
						<li key={player.username}>
							{player.username} - {player.role}
						</li>
					))}
				</ul>
			) : (
				<p>No players in the lobby.</p>
			)}
		</div>
	)
}

export default PlayersInLobby
