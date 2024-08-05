import React from 'react';
import LobbyForm from '../components/LobbyForm';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateLobby = async (data: { username: string }) => {
	try {
		const response = await axios.post(
			'http://localhost:8080/create-lobby',
			data
		);
		return response.data; // Assumes response contains { lobbyId }
	} catch (error) {
		console.error('Error creating lobby:', error);
		throw error;
	}
};

const JoinLobby = async (data: { username: string; lobbyId: string }) => {
	try {
		const response = await axios.post(
			'http://localhost:8080/join-lobby',
			data
		);
		return response.data; // Assumes response contains necessary information
	} catch (error) {
		console.error('Error joining lobby:', error);
		throw error;
	}
};

const IndexPage: React.FC = () => {
	const navigate = useNavigate();

	const handleSubmit = async (formData: {
		username: string;
		lobbyId?: string;
	}) => {
		try {
			if (formData.lobbyId != null) {
				await JoinLobby({
					username: formData.username,
					lobbyId: formData.lobbyId,
				});
				navigate(`/lobby`);
			} else {
				await CreateLobby({
					username: formData.username,
				});
				navigate(`/lobby`);
			}
		} catch (error) {
			console.error('Error during submission:', error);
		}
	};

	return (
		<div>
			<h1>Index Page</h1>
			<LobbyForm onSubmit={handleSubmit} />
		</div>
	);
};

export default IndexPage;
