import React, { useState } from "react";
import { LobbySettings as LobbySettingsType } from "../../types";
import { editLobbySettings } from "../../api/lobby/editLobbySettingsApi";
import { useWebSocketContext } from "../../context/webSocketContext";
import LobbySettingsDisplay from "./LobbySettingsDisplay";
import { handleEditLobbySettings } from "../../utils/messageHandler";
import { useLanguage } from "../../context/languageContext";

type LobbySettingsProps = {
  sessionId: string;
  lobbyId: string;
  username: string;
  role: string;
  lobbySettings: LobbySettingsType;
  playerCount: number;
};

const LobbySettings: React.FC<LobbySettingsProps> = ({
  sessionId,
  lobbyId,
  username,
  role,
  lobbySettings,
  playerCount,
}) => {
  const { sendMessage } = useWebSocketContext();
  const { language } = useLanguage();
  const [maxPlayerCount, setMaxPlayerCount] = useState(
    lobbySettings.MaxPlayerCount,
  );
  const [promptInputTime, setPromptInputTime] = useState(
    lobbySettings.PromptInputTime,
  );
  const [drawingTime, setDrawingTime] = useState(lobbySettings.DrawingTime);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [
    hasSentRefetchLobbyDetailsMessage,
    setHasSentRefetchLobbyDetailsMessage,
  ] = useState(false);

  const handleUpdateClick = async () => {
    if (playerCount > maxPlayerCount) {
      setError(
        language === "en"
          ? "Current player count exceeds the selected maximum player count."
          : "Pašreizējais spēlētāju skaits pārsniedz izvēlēto maksimālo spēlētāju skaitu.",
      );
      return;
    }

    try {
      await editLobbySettings({
        settings: {
          LobbySettingsId: lobbySettings.LobbySettingsId,
          MaxPlayerCount: maxPlayerCount,
          PromptInputTime: promptInputTime,
          DrawingTime: drawingTime,
          LobbyStatus: lobbySettings.LobbyStatus,
        },
      });

      if (!hasSentRefetchLobbyDetailsMessage) {
        handleEditLobbySettings(sessionId, lobbyId, username, sendMessage);
        setHasSentRefetchLobbyDetailsMessage(true);
      }

      setError(null);
      setIsEditing(false);
    } catch (err) {
      setError(
        language === "en"
          ? "Failed to edit lobby settings."
          : "Neizdevās mainīt istabas iestatījumus.",
      );
    }
  };

  return (
    <LobbySettingsDisplay
      role={role}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      maxPlayerCount={maxPlayerCount}
      setMaxPlayerCount={setMaxPlayerCount}
      promptInputTime={promptInputTime}
      setPromptInputTime={setPromptInputTime}
      drawingTime={drawingTime}
      setDrawingTime={setDrawingTime}
      handleUpdateClick={handleUpdateClick}
      error={error}
      lobbySettings={lobbySettings}
    />
  );
};

export default LobbySettings;
