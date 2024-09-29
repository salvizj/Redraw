import React, { useState } from "react";
import { editLobbySettings } from "../../api/lobby/editLobbySettingsApi";
import LobbySettingsDisplay from "./LobbySettingsDisplay";
import { useLanguage } from "../../context/languageContext";
import { useWsMessageSender } from "../../hooks/ws/useWsMessageSender";
import { LobbySettingsProps } from "../../types";

const LobbySettings: React.FC<LobbySettingsProps> = ({
  sessionId,
  lobbyId,
  username,
  role,
  lobbySettings,
  playerCount,
}) => {
  const { language } = useLanguage();
  const [maxPlayerCount, setMaxPlayerCount] = useState(playerCount);
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
  const { handleEditLobbySettings } = useWsMessageSender(
    sessionId,
    lobbyId,
    username,
  );

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
        },
      });

      if (!hasSentRefetchLobbyDetailsMessage) {
        handleEditLobbySettings();
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
