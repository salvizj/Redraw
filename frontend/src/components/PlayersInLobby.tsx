import React from 'react'
import { Player } from '../types'

type PlayersInLobbyProps = {
	players: Player[]
}

const PlayersInLobby: React.FC<PlayersInLobbyProps> = ({ players }) => (
	<div>
		<h3>Players in Lobby</h3>
		{players.length > 0 ? (
			<ul>
				{players.map((player, index) => (
					<li key={index}>
						<strong>Username:</strong> {player.username} <br />
						<strong>Role:</strong> {player.role}
					</li>
				))}
			</ul>
		) : (
			<p>No players in the lobby.</p>
		)}
	</div>
)

export default PlayersInLobby
