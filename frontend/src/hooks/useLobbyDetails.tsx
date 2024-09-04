import { useState, useCallback } from "react";
import { fetchLobbyDetails } from "../api/getLobbyDetailsApi";

type Player = {
  username: string;
  role: string;
};
type LobbyDetails = {
  lobbyId: string;
  players: Player[];
};

export const useLobbyDetails = () => {
  const [lobbyDetails, setLobbyDetails] = useState<LobbyDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    try {
      const details = await fetchLobbyDetails();
      setLobbyDetails(details);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { lobbyDetails, loading, error, fetchDetails };
};
