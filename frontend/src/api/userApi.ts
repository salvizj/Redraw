import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const GetUserInfo = async (data: { sessionId: string }) => {
	try {
		const response = await axios.post(`${BASE_URL}/get-user-info`, data);
		return response.data;
	} catch (error) {
		console.error('Error fetching user info:', error);
		throw error;
	}
};
