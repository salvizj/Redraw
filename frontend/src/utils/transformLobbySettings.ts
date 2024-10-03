import { LobbySettings } from "../types";

export const transformLobbySettings = (apiData: any): LobbySettings => {
  return {
    lobbySettingsId: apiData.lobbySettingsId,
    maxPlayerCount: apiData.maxPlayerCount,
    promptInputTime: apiData.promptInputTime,
    drawingTime: apiData.drawingTime,
  };
};
