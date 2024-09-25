import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLobbyContext } from "../context/lobbyContext";
import { useUserContext } from "../context/userContext";
import { useWebSocketContext } from "../context/webSocketContext";
import { useLobbyDetails } from "../hooks/useLobbyDetails";
import { useUserDetails } from "../hooks/useUserDetails";
import { useLanguage } from "../context/languageContext";
import Loading from "../components/utils/Loading";
import { handleStartGame } from "../utils/messageHandler";
import LobbyPlayers from "../components/lobby/LobbyPlayers";
import LobbyIdSection from "../components/lobby/LobbyIdSection";
import LobbyStartButton from "../components/lobby/LobbyStartButton";
import LobbySettings from "../components/lobby/LobbySettings";
import ErrorMessage from "../components/utils/ErrorMessage";

const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const { lobbyId, players, lobbySettings } = useLobbyContext();
  const { username, role, sessionId } = useUserContext();
  const {
    sendMessage,
    shouldRefetchLobby,
    setShouldRefetchLobby,
    connectWebSocket,
    gameStarted,
    isConnected,
  } = useWebSocketContext();
  const { language } = useLanguage();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { fetchDetails: fetchLobbyDetails, error: errorLobbyDetails } =
    useLobbyDetails();
  const { fetchDetails: fetchUserDetails, error: errorUserDetails } =
    useUserDetails();

  const fetchData = useCallback(async () => {
    try {
      await Promise.all([fetchUserDetails(), fetchLobbyDetails()]);
    } catch (error) {
      setError(
        language === "en"
          ? "Failed to fetch lobby or user details."
          : "Neizdevās iegūt istabas vai lietotāja informāciju.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserDetails, fetchLobbyDetails, language]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (shouldRefetchLobby) {
      fetchLobbyDetails()
        .catch(() => {
          setError(
            language === "en"
              ? "Failed to refetch lobby details."
              : "Neizdevās atkārtoti iegūt istabas informāciju.",
          );
        })
        .finally(() => {
          setShouldRefetchLobby(false);
        });
    }
  }, [shouldRefetchLobby, fetchLobbyDetails, setShouldRefetchLobby, language]);

  useEffect(() => {
    if (sessionId && lobbyId && !isConnected) {
      connectWebSocket(sessionId, lobbyId);
    }
  }, [sessionId, lobbyId, isConnected, connectWebSocket]);

  useEffect(() => {
    if (gameStarted) {
      navigate("/game");
    }
  }, [gameStarted, navigate]);

  const onStartGame = () => {
    if (sessionId && lobbyId && username) {
      handleStartGame(sessionId, lobbyId, username, sendMessage);
    }
  };

  if (isLoading) {
    return (
      <Loading
        messages={[
          language === "en"
            ? "Connecting to the lobby..."
            : "Savienojas ar istabu...",
          language === "en"
            ? "Gathering user details..."
            : "Vāc lietotāja informāciju...",
          language === "en" ? "Almost there..." : "Gandrīz pabeigts...",
        ]}
      />
    );
  }

  if (error || errorUserDetails || errorLobbyDetails) {
    return (
      <ErrorMessage
        message={
          error ||
          errorUserDetails?.message ||
          errorLobbyDetails?.message ||
          "An error occurred"
        }
      />
    );
  }

  if (!lobbyId || !username || !sessionId || !lobbySettings || !role) {
    return (
      <p>
        {language === "en"
          ? "Failed to join lobby"
          : "Neizdevās pievienoties istabai"}
      </p>
    );
  }

  return (
    <div className="min-h-screen justify-center items-center">
      <LobbyIdSection lobbyId={lobbyId} />
      <div className="flex flex-row justify-between items-start gap-4">
        <div className="w-1/2">
          <LobbyPlayers players={players} />
        </div>
        <div className="w-1/2">
          <LobbySettings
            playerCount={players.length}
            lobbyId={lobbyId}
            username={username}
            role={role}
            lobbySettings={lobbySettings}
            sessionId={sessionId}
          />
        </div>
      </div>
      <LobbyStartButton
        role={role}
        playerCount={players.length}
        handleStart={onStartGame}
      />
    </div>
  );
};

export default LobbyPage;
