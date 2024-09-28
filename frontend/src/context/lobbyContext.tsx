import React, { createContext, useContext, useState } from "react"
import { LobbySettings } from "../types"
import { Player, LobbyContextType } from "../types"

const LobbyContext = createContext<LobbyContextType | undefined>(undefined)

export const useLobbyContext = () => {
	const context = useContext(LobbyContext)
	if (context === undefined) {
		throw new Error("useLobbyContext must be used within a LobbyProvider")
	}
	return context
}

export const LobbyProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [lobbyId, setLobbyId] = useState<string>("")
	const [players, setPlayers] = useState<Player[]>([])
	const [playerCount, setPlayerCount] = useState<number>(0)
	const [lobbySettings, setLobbySettings] = useState<LobbySettings | null>(
		null
	)

	return (
		<LobbyContext.Provider
			value={{
				lobbyId,
				players,
				playerCount,
				lobbySettings,
				setPlayerCount,
				setLobbyId,
				setPlayers,
				setLobbySettings,
			}}
		>
			{children}
		</LobbyContext.Provider>
	)
}
