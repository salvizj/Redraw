import { LobbySettings } from "../types";

export const transformLobbySettings = (apiData: any): LobbySettings => {
  return {
    LobbySettingsId: apiData.lobbySettingsId,
    MaxPlayerCount: apiData.maxPlayerCount,
    PromptInputTime: apiData.promptInputTime,
    DrawingTime: apiData.drawingTime,
    LobbyStatus: apiData.lobbyStatus,
  };
};
