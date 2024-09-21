import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL
const PORT = import.meta.env.VITE_PORT

export const fetchLobbyDetails = async () => {
	try {
		const response = await axios.get(
			`${BASE_URL}:${PORT}/get-lobby-details`
		)
		return response.data
	} catch (error) {
		throw error
	}
}
