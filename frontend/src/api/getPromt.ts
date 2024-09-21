import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL
const PORT = import.meta.env.VITE_PORT

export const getPrompt = async (data: {
	sessionId: string
	lobbyId: string
}) => {
	try {
		const response = await axios.post(
			`${BASE_URL}:${PORT}/get-prompt`,
			data
		)
		return response.data
	} catch (error) {
		throw error
	}
}
