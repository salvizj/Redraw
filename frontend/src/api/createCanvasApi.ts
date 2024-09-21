import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL
const PORT = import.meta.env.VITE_PORT

export const createCanvas = async (dataUrl: string) => {
	try {
		const response = await axios.post(`${BASE_URL}:${PORT}/create-canvas`, {
			image: dataUrl,
		})
		return response.data
	} catch (error) {
		throw error
	}
}
