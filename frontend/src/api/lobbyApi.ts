import axios from 'axios';

const BASE_URL = process.env.BASE_URL;

export const createLobby = async (data: { username: string }) => {
	try {
		const response = await axios.post(`${BASE_URL}/create-lobby`, data);
		return response.data;
	} catch (error) {
		console.error('Error creating lobby:', error);
		throw error;
	}
};

export const joinLobby = async (data: {
	username: string;
	lobbyId: string;
}) => {
	try {
		const response = await axios.post(`${BASE_URL}/join-lobby`, data);
		return response.data;
	} catch (error) {
		console.error('Error joining lobby:', error);
		throw error;
	}
};
