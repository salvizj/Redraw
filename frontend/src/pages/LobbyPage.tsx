import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLobbyContext } from "../context/lobbyContext";
import { useUserContext } from "../context/userContext";

const LobbyPage: React.FC = () => {
  const { lobbyId, players } = useLobbyContext();
  const { username, role } = useUserContext();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCopyToClipboard = () => {
    if (lobbyId) {
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const url = `${BASE_URL}/?l=${lobbyId}`;
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          setCopyError(null);
        })
        .catch((err) => {
          setCopyError("Failed to copy the text to clipboard.");
          console.error("Failed to copy the text to clipboard:", err);
        });
    }
  };

  const handleStart = () => {
    navigate("/game");
  };

  return (
    <div>
      <h1>Lobby Page</h1>
      {lobbyId ? (
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
          {copyError && <p style={{ color: "red" }}>{copyError}</p>}
          <button onClick={handleCopyToClipboard}>Copy Lobby URL</button>
          {copied && <p style={{ color: "green" }}>Copied to clipboard!</p>}
        </div>
      ) : (
        <p>No lobby joined.</p>
      )}
      {role === "leader" && <button onClick={handleStart}>Start</button>}
      {role === "player" && <p>Wait for the leader to start the game</p>}
    </div>
  );
};

export default LobbyPage;
