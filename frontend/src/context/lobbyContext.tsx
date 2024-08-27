import React, { createContext, useContext, useState } from 'react';
import { Player } from '../types';

type LobbyContextType = {
	lobbyId: string | null;
	players: Player[];
	setLobbyId: (lobbyId: string | null) => void;
	setPlayers: (players: Player[]) => void;
};

const LobbyContext = createContext<LobbyContextType | undefined>(undefined);

export const useLobbyContext = () => {
	const context = useContext(LobbyContext);
	if (context === undefined) {
		throw new Error('useLobbyContext must be used within a LobbyProvider');
	}
	return context;
};

export const LobbyProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [lobbyId, setLobbyId] = useState<string | null>(null);
	const [players, setPlayers] = useState<Player[]>([]);

	console.log('Provider values:', { lobbyId, players });

	return (
		<LobbyContext.Provider
			value={{ lobbyId, players, setLobbyId, setPlayers }}
		>
			{children}
		</LobbyContext.Provider>
	);
};
