import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  GameState,
  GameStateContextType,
  Message,
  MessageType,
} from "../types";
import { useWebSocketContext } from "./webSocketContext";

const GameStateContext = createContext<GameStateContextType | undefined>(
  undefined,
);

export const useGameStateContext = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error(
      "useGameStateContext must be used within a GameStateProvider",
    );
  }
  return context;
};

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState<GameState>(
    GameState.StatusWaitingForPlayers,
  );
  const [shouldRefetchLobbyDetails, setShouldRefetchLobbyDetails] =
    useState(false);
  const { messages } = useWebSocketContext();

  const handleMessage = useCallback((message: Message) => {
    if (
      message.type === MessageType.Join ||
      message.type === MessageType.EditLobbySettings
    ) {
      console.log("We got join or edit messages", message);
      setShouldRefetchLobbyDetails(true);
    }
    if (message.type === MessageType.GameStateChanges) {
      const newStateValue: string = message.data;
      if (
        Object.keys(GameState).some(
          (key) => GameState[key as keyof typeof GameState] === newStateValue,
        )
      ) {
        setGameState(newStateValue as GameState);
      } else {
        console.error(`Invalid game state received: ${newStateValue}`);
      }
    }
  }, []);

  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage) {
      handleMessage(latestMessage);
    }
  }, [messages, handleMessage]);

  return (
    <GameStateContext.Provider
      value={{
        gameState,
        setGameState,
        shouldRefetchLobbyDetails,
        setShouldRefetchLobbyDetails,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
