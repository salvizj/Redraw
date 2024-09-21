import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL

export const createPrompt = async (data: {
	prompt: string
	sessionId: string
	lobbyId: string
	username: string
}) => {
	try {
		const response = await axios.post(`${BASE_URL}/create-prompt`, data, {
			headers: {
				"Content-Type": "application/json",
			},
		})
		return response.data
	} catch (error) {
		throw error
	}
}
