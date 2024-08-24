import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LobbyContextType, Player } from '../types';

const LobbyContext = createContext<LobbyContextType | undefined>(undefined);

const LobbyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [lobbyId, setLobbyId] = useState<string | null>(null);
	const [players, setPlayers] = useState<Player[]>([]);

	return (
		<LobbyContext.Provider
			value={{ lobbyId, players, setLobbyId, setPlayers }}
		>
			{children}
		</LobbyContext.Provider>
	);
};

const useLobbyContext = (): LobbyContextType => {
	const context = useContext(LobbyContext);
	if (!context) {
		throw new Error('useLobbyContext must be used within a LobbyProvider');
	}
	return context;
};

export { LobbyProvider, useLobbyContext };
