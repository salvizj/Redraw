import React from "react"
import { Player } from "../types"

type PlayersInLobbyProps = {
	players: Player[]
}

const PlayersInLobby: React.FC<PlayersInLobbyProps> = ({ players }) => {
	return (
		<div className="p-4  rounded-lg shadow-md">
			<h3 className="text-xl font-semibold mb-4 text-form-text">
				Players in Lobby
			</h3>
			{players.length > 0 ? (
				<ul className="list-disc list-inside space-y-2">
					{players.map((player, index) => (
						<li
							key={index}
							className="p-2 border-b border-message-item-border"
						>
							<p>
								<strong className="font-medium">
									Username:
								</strong>{" "}
								{player.username}
							</p>
							<p>
								<strong className="font-medium">Role:</strong>{" "}
								{player.role}
							</p>
						</li>
					))}
				</ul>
			) : (
				<p className="text-form-text">No players in the lobby.</p>
			)}
		</div>
	)
}

export default PlayersInLobby
