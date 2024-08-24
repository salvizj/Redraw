import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LobbyForm from '../components/LobbyForm';
import { createLobby, joinLobby } from '../api/submitLobbyFormApi';
import { useLobbyContext } from '../context/lobbyContext';
import { useUserContext } from '../context/userContext';
import { useLobbyDetails } from '../hooks/useLobbyDetails';
import { useUserDetails } from '../hooks/useUserDetails';
import { FormData } from '../types';

const IndexPage: React.FC = () => {
	const navigate = useNavigate();
	const { setLobbyId, setPlayers } = useLobbyContext();
	const { setUsername, setRole } = useUserContext();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { fetchDetails: fetchLobbyDetails, lobbyDetails } = useLobbyDetails();
	const { fetchDetails: fetchUserDetails, userDetails } = useUserDetails();

	const handleSubmit = async (formData: FormData) => {
		setLoading(true);
		setError(null);

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

			setUsername(formData.username);
			setRole(responseData.role);

			await fetchUserDetails();
			await fetchLobbyDetails();

			if (userDetails && lobbyDetails) {
				setLobbyId(lobbyDetails.lobbyId);
				setPlayers(lobbyDetails.players);
			}

			navigate('/lobby');
		} catch (error) {
			setError('Error during submission');
			console.error('Error during submission:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div>
			<h1>Index Page</h1>
			<LobbyForm onSubmit={handleSubmit} />
		</div>
	);
};

export default IndexPage;
