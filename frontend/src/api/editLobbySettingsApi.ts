import { LobbySettings } from "./../types"
import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL
const PORT = import.meta.env.VITE_PORT

export const editLobbySettings = async (settings: LobbySettings) => {
	try {
		const response = await axios.patch(
			`${BASE_URL}:${PORT}/edit-lobby-settings`,
			settings,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		)
		return response.data
	} catch (error) {
		console.error("Error editing lobby settings:", error)
		throw new Error("Failed to edit lobby settings")
	}
}
