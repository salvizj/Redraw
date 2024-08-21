import React, { createContext, useContext, useState, ReactNode } from 'react';

type LobbyContextType = {
	lobbyId: string | null;
	setLobbyId: React.Dispatch<React.SetStateAction<string | null>>;
};

const LobbyContext = createContext<LobbyContextType | undefined>(undefined);

const LobbyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [lobbyId, setLobbyId] = useState<string | null>(null);

	return (
		<LobbyContext.Provider value={{ lobbyId, setLobbyId }}>
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
