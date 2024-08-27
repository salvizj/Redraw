import React, { useEffect, useState } from "react";
import { useLobbyContext } from "../context/lobbyContext";
import { useUserContext } from "../context/userContext";
import { useLobbyDetails } from "../hooks/useLobbyDetails";
import { useUserDetails } from "../hooks/useUserDetails";
import { useWebSocket } from "../hooks/useWebSocket";
import { HandleCopyToClipboard } from "../components/HandleCopyToClipboard";

const LobbyPage: React.FC = () => {
  const { lobbyId, players, setLobbyId, setPlayers } = useLobbyContext();
  const { username, role, setUsername, setRole } = useUserContext();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { message, sendMessage } = useWebSocket();

  const {
    fetchDetails: fetchLobbyDetails,
    lobbyDetails,
    loading: loadingLobbyDetails,
    error: errorLobbyDetails,
  } = useLobbyDetails();

  const {
    fetchDetails: fetchUserDetails,
    userDetails,
    loading: loadingUserDetails,
    error: errorUserDetails,
  } = useUserDetails();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserDetails();
        await fetchLobbyDetails();
      } catch {
        setFetchError("Failed to fetch lobby or user details.");
      }
    };

    fetchData();
  }, [fetchUserDetails, fetchLobbyDetails]);

  useEffect(() => {
    if (userDetails && lobbyDetails) {
      setUsername(userDetails.username);
      setRole(userDetails.role);
      setLobbyId(lobbyDetails.lobbyId);
      setPlayers(lobbyDetails.players);
    }
  }, [userDetails, lobbyDetails, setUsername, setRole, setLobbyId, setPlayers]);

  // const handleJoin = () => {
  // 	sendMessage('join', { sessionId: '12345' });
  // };

  const handleStart = () => {
    sendMessage("startGame", {});
  };

  return (
    <div>
      <h1>Lobby Page</h1>
      {loadingUserDetails || loadingLobbyDetails ? (
        <p>Loading...</p>
      ) : errorUserDetails || errorLobbyDetails || fetchError ? (
        <p style={{ color: "red" }}>
          Error:{" "}
          {fetchError ||
            errorUserDetails?.message ||
            errorLobbyDetails?.message}
        </p>
      ) : lobbyId ? (
        <div>
          <p>Lobby ID: {lobbyId}</p>
          <p>Username: {username}</p>
          <p>User Role: {role}</p>
          {players.length > 0 && (
            <div>
              <h2>Players in Lobby:</h2>
              <ul>
                {players.map((player) => (
                  <li key={player.username}>
                    {player.username} - {player.role}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            onClick={() =>
              HandleCopyToClipboard(lobbyId, setCopied, setCopyError)
            }
          >
            Copy Lobby URL
          </button>
          {copied && <p style={{ color: "green" }}>Copied to clipboard!</p>}
          {copyError && <p style={{ color: "red" }}>{copyError}</p>}
        </div>
      ) : (
        <p>No lobby joined.</p>
      )}
      {role === "leader" && <button onClick={handleStart}>Start</button>}
      {role === "player" && <p>Wait for the leader to start the game</p>}
      <div>
        <h2>Latest Message:</h2>
        <p>{message ? JSON.stringify(message) : "No messages yet"}</p>
      </div>
    </div>
  );
};

export default LobbyPage;
