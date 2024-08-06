import React, { createContext, useContext, useState, ReactNode } from 'react';

type LobbyContextType = {
	lobbyId: string | null;
	setLobbyId: React.Dispatch<React.SetStateAction<string | null>>;
};

const LobbyContext = createContext<LobbyContextType | undefined>(undefined);

type LobbyProviderProps = {
	children: ReactNode;
};

export const LobbyProvider: React.FC<LobbyProviderProps> = ({ children }) => {
	const [lobbyId, setLobbyId] = useState<string | null>(null);

	return (
		<LobbyContext.Provider value={{ lobbyId, setLobbyId }}>
			{children}
		</LobbyContext.Provider>
	);
};

export const useLobby = (): LobbyContextType => {
	const context = useContext(LobbyContext);
	if (context === undefined) {
		throw new Error('useLobby must be used within a LobbyProvider');
	}
	return context;
};
