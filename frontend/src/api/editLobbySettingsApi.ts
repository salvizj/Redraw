import { LobbySettings } from "./../types"
import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL

export const editLobbySettings = async (settings: LobbySettings) => {
	try {
		const response = await axios.patch(
			`${BASE_URL}/edit-lobby-settings`,
			settings
		)
		return response.data
	} catch (error) {
		console.error("Error editing lobby settings:", error)
		throw new Error("Failed to edit lobby settings")
	}
}
