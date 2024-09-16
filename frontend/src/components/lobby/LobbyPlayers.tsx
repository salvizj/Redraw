import React from "react"
import { Player } from "../../types"

type LobbyPlayersProps = {
	players: Player[]
}

const LobbyPlayers: React.FC<LobbyPlayersProps> = ({ players }) => {
	return (
		<div className="flex flex-col items-center bg-background-light dark:bg-background-dark p-6 rounded-lg">
			<h1 className="text-primary-light dark:text-primary-dark text-4xl font-bold mb-4">
				Players in Lobby
			</h1>
			{players.length > 0 ? (
				<ul className="flex flex-wrap justify-center gap-4">
					{players.map((player, index) => (
						<li
							key={index}
							className="p-4 border-2 border-primary-light dark:border-primary-dark rounded-xl text-center"
						>
							<p className="text-text-light dark:text-text-dark text-2xl font-semibold">
								Username {player.username}
							</p>
							{player.role === "leader" && (
								<p className="text-text-light dark:text-text-dark">
									<strong>Role:</strong> Leader
								</p>
							)}
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
