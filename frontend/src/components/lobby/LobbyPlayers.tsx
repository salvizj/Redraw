import React from "react"
import { Player } from "../../types"

type LobbyPlayersProps = {
	players: Player[]
}

const LobbyPlayers: React.FC<LobbyPlayersProps> = ({ players }) => {
	return (
		<div className="bg-background-light dark:bg-background-dark p-6 rounded-full text-center">
			<h3 className="text-primary-light dark:text-primary-dark text-xl font-bold mb-4">
				Players in Lobby
			</h3>
			{players.length > 0 ? (
				<ul className="list-disc pl-5 text-left">
					{players.map((player, index) => (
						<li key={index} className="mb-3">
							<p className="text-text-light dark:text-text-dark">
								<strong>Username:</strong> {player.username}
							</p>
							<p className="text-text-light dark:text-text-dark">
								<strong>Role:</strong> {player.role}
							</p>
						</li>
					))}
				</ul>
			) : (
				<p className="text-text-light dark:text-text-dark">
					No players in the lobby.
				</p>
			)}
		</div>
	)
}

export default LobbyPlayers
