import React from "react";
import PlayersInLobby from "./PlayersInLobbyDisplay";
import HandleCopyToClipboard from "./HandleCopyToClipboard";
import StartButton from "./LobbyStartButton";
import { Player, LobbySettings } from "../types";

type LobbyDetailsProps = {
  lobbyId: string;
  username: string;
  role: string;
  players: Player[];
  handleStartGame: () => void;
  loading: boolean;
  lobbySettings: LobbySettings;
  playerCount: number;
};

const LobbyDetails: React.FC<LobbyDetailsProps> = ({
  lobbyId,
  username,
  role,
  players,
  handleStartGame,
  loading,
  lobbySettings,
  playerCount,
}) => {
  if (loading) {
    return (
      <div className="text-center">
        <p className="mb-2">Connecting to the lobby...</p>
        <p className="mb-2">Gathering user details...</p>
        <p>Almost there...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">Lobby Details</h2>
      <div className="mb-4">
        <p className="text-lg">
          <strong>Lobby ID:</strong> {lobbyId}
        </p>
        <HandleCopyToClipboard lobbyId={lobbyId} />
      </div>
      <p className="mb-2">
        <strong>Username:</strong> {username}
      </p>
      <p className="mb-2">
        <strong>User Role:</strong> {role}
      </p>
      <p className="mb-2">
        <strong>Lobby Status:</strong> {lobbySettings.LobbyStatus}
      </p>
      <p className="mb-2">
        <strong>Max Player Count:</strong> {lobbySettings.MaxPlayerCount}
      </p>
      <p className="mb-4">
        <strong>Current Player Count:</strong> {playerCount}
      </p>

      <PlayersInLobby players={players} />

      {role === "leader" && (
        <StartButton handleStart={handleStartGame} role={role} />
      )}
    </div>
  );
};

export default LobbyDetails;
