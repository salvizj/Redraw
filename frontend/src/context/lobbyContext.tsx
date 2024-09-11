import React, { createContext, useContext, useState } from 'react'
import { LobbySettings } from '../types'

type Player = {
	username: string
	role: string
}

type LobbyContextType = {
	lobbyId: string | null
	playerCount: number | null
	players: Player[]
	lobbySettings: LobbySettings | null
	setLobbyId: (lobbyId: string | null) => void
	setPlayerCount: (playerCount: number) => void
	setPlayers: (players: Player[]) => void
	setLobbySettings: (settings: LobbySettings | null) => void
}

const LobbyContext = createContext<LobbyContextType | undefined>(undefined)

export const useLobbyContext = () => {
	const context = useContext(LobbyContext)
	if (context === undefined) {
		throw new Error('useLobbyContext must be used within a LobbyProvider')
	}
	return context
}

export const LobbyProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [lobbyId, setLobbyId] = useState<string | null>(null)
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
