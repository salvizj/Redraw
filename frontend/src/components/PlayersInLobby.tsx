import React from 'react'
import { Player } from '../types'

interface PlayersInLobbyProps {
	players: Player[]
}

const PlayersInLobby: React.FC<PlayersInLobbyProps> = ({ players }) => {
	return (
		<div className="mt-4">
			<h2 className="text-xl font-semibold mb-2">Players in Lobby:</h2>
			{players.length > 0 ? (
				<ul className="list-disc pl-5">
					{players.map((player) => (
						<li key={player.username} className="mb-2">
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
