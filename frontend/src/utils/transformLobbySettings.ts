import { LobbySettings } from "../types"

export const transformLobbySettings = (apiData: any): LobbySettings => {
	return {
		LobbySettingsId: apiData.lobbySettingsId,
		MaxPlayerCount: apiData.maxPlayerCount,
		PromtInputTime: apiData.promtInputTime,
		DrawingTime: apiData.drawingTime,
		LobbyStatus: apiData.lobbyStatus,
	}
}
