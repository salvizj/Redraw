import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const GetUserRole = async (data: { sessionId: string }) => {
	try {
		const response = await axios.post(`${API_URL}/get-user-role`, data);
		return response.data;
	} catch (error) {
		console.error('Error getting user role:', error);
		throw error;
	}
};
