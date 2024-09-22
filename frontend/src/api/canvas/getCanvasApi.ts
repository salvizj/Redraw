import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL

export const getCanvas = async (data: {
	lobbyId: string
	sessionId: string
}) => {
	try {
		const response = await axios.post(`${BASE_URL}/get-canvas`, {
			data,
		})
		return response.data
	} catch (error) {
		throw error
	}
}
