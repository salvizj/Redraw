import { useState, useCallback } from "react";
import { getGameState } from "../api/gameState/getGameState";
import { editGameState } from "../api/gameState/editGameState";
import { GameState } from "../types";

export const useGameState = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [gameStateError, setGameStateError] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  const fetchGameState = useCallback(async () => {
    setLoading(true);
    setGameStateError(null);
    try {
      const data = await getGameState();
      setGameState(data);
    } catch (err) {
      setGameStateError(err as string);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEditGameState = useCallback(async (lobbyId: string) => {
    setLoading(true);
    setGameStateError(null);
    try {
      const updatedGameState = await editGameState({ lobbyId });
      setGameState(updatedGameState);
    } catch (err) {
      setGameStateError(err as string);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    gameStateError,
    gameState,
    fetchGameState,
    fetchEditGameState,
  };
};
