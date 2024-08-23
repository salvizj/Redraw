import React from 'react';
import LobbyForm from '../components/LobbyForm';
import { useNavigate } from 'react-router-dom';
import { useLobbyContext } from '../context/LobbyContext';
import { createLobby, joinLobby } from '../api/lobbyApi';

const IndexPage: React.FC = () => {
	const navigate = useNavigate();
	const { setLobbyId } = useLobbyContext();

	const handleSubmit = async (formData: {
		username: string;
		lobbyId?: string;
	}) => {
		try {
			let lobbyData;
			if (formData.lobbyId) {
				lobbyData = await joinLobby({
					username: formData.username,
					lobbyId: formData.lobbyId,
				});
			} else {
				lobbyData = await createLobby({
					username: formData.username,
				});
			}
			setLobbyId(lobbyData.lobbyId);
			navigate(`/lobby`);
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
