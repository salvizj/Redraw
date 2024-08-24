import React from 'react';
import { useNavigate } from 'react-router-dom';
import LobbyForm from '../components/LobbyForm';
import { createLobby, joinLobby } from '../api/submitLobbyFormApi';
import { fetchLobbyDetails } from '../api/getLobbyDetailsApi';
import { useLobbyContext } from '../context/lobbyContext';

const IndexPage: React.FC = () => {
	const navigate = useNavigate();
	const { setLobbyId, setPlayers } = useLobbyContext();

	const handleSubmit = async (formData: {
		username: string;
		lobbyId?: string;
	}) => {
		try {
			let responseData;
			if (formData.lobbyId) {
				responseData = await joinLobby({
					username: formData.username,
					lobbyId: formData.lobbyId,
				});
			} else {
				responseData = await createLobby({
					username: formData.username,
				});
			}

			const details = await fetchLobbyDetails();

			setLobbyId(details.lobbyId);
			setPlayers(details.players);

			navigate('/lobby');
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
