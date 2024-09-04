import React, { useEffect, useState } from "react";
import { useLobbyContext } from "../context/lobbyContext";
import { useUserContext } from "../context/userContext";
import { useWebSocketContext } from "../context/webSocketContext";
import { useLobbyDetails } from "../hooks/useLobbyDetails";
import { useUserDetails } from "../hooks/useUserDetails";
import PlayersInLobby from "../components/PlayersInLobby";
import HandleCopyToClipboard from "../components/HandleCopyToClipboard";

enum MessageType {
  Join = "join",
  Leave = "leave",
  StartGame = "startGame",
  Notification = "notification",
  GameStarted = "gameStarted",
}

type Message = {
  type: MessageType;
  sessionId: string;
  lobbyId: string;
  data: any;
};

const LobbyPage: React.FC = () => {
  const { lobbyId, players, setLobbyId, setPlayers } = useLobbyContext();
  const { username, role, setSessionId, setUsername, setRole } =
    useUserContext();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { connect, sendMessage, closeConnection, readMessages } =
    useWebSocketContext();

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
      } catch (error) {
        setFetchError("Failed to fetch lobby or user details.");
      }
    };
    fetchData();
  }, [fetchUserDetails, fetchLobbyDetails]);

  useEffect(() => {
    if (userDetails && lobbyDetails) {
      setSessionId(userDetails.sessionId);
      setUsername(userDetails.username);
      setRole(userDetails.role);
      setLobbyId(lobbyDetails.lobbyId);
      setPlayers(lobbyDetails.players);
    }
  }, [
    userDetails,
    lobbyDetails,
    setSessionId,
    setUsername,
    setRole,
    setLobbyId,
    setPlayers,
  ]);

  useEffect(() => {
    connect();

    return () => {
      closeConnection();
    };
  }, [connect, closeConnection]);

  useEffect(() => {
    // Define a callback to handle incoming messages
    const handleMessage = (message: Message) => {
      console.log("Received message:", message);
    };

    readMessages(handleMessage);
  }, [readMessages]);

  const handleSendMessage = () => {
    sendMessage({
      type: MessageType.Notification,
      sessionId: "1234",
      lobbyId: "abcd",
      data: { some: "data" },
    });
  };

  const renderLoading = () => <p className="text-blue-300">Loading...</p>;

  const renderError = () => (
    <p className="text-red-500">
      Error:{" "}
      {fetchError || errorUserDetails?.message || errorLobbyDetails?.message}
    </p>
  );

  const renderLobby = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
      <p className="text-lg mb-2">Lobby ID: {lobbyId}</p>
      <p className="text-lg mb-2">Username: {username}</p>
      <p className="text-lg mb-4">User Role: {role}</p>
      <button onClick={handleSendMessage}>Send Message</button>
      <PlayersInLobby players={players} />
      <HandleCopyToClipboard lobbyId={lobbyId} />
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-blue-400">Lobby Page</h1>
      {loadingUserDetails || loadingLobbyDetails ? (
        renderLoading()
      ) : fetchError || errorUserDetails || errorLobbyDetails ? (
        renderError()
      ) : lobbyId ? (
        renderLobby()
      ) : (
        <p>No lobby joined.</p>
      )}
    </div>
  );
};

export default LobbyPage;
