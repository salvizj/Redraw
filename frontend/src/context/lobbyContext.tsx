import React, { createContext, useContext, useState } from "react";

type Player = {
  username: string;
  role: string;
};

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
    throw new Error("useLobbyContext must be used within a LobbyProvider");
  }
  return context;
};

export const LobbyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lobbyId, setLobbyId] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  return (
    <LobbyContext.Provider value={{ lobbyId, players, setLobbyId, setPlayers }}>
      {children}
    </LobbyContext.Provider>
  );
};
