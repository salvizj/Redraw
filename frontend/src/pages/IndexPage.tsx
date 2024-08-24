import React, { useEffect } from 'react';
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
	const { setSessionId, setUsername, setRole } = useUserContext();

	// Using hooks to fetch user and lobby details
	const {
		userDetails,
		loading: userLoading,
		error: userError,
	} = useUserDetails();
	const {
		lobbyDetails,
		loading: lobbyLoading,
		error: lobbyError,
	} = useLobbyDetails();

	const handleSubmit = async (formData: FormData) => {
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

			setSessionId(responseData.sessionId);
			setUsername(formData.username);
			setRole(responseData.role);
		} catch (error) {
			console.error('Error during submission:', error);
		}
	};

	useEffect(() => {
		if (userDetails && lobbyDetails) {
			setLobbyId(lobbyDetails.lobbyId);
			setPlayers(lobbyDetails.players);

			navigate('/lobby');
		}
	}, [userDetails, lobbyDetails, setLobbyId, setPlayers, navigate]);

	if (userLoading || lobbyLoading) return <div>Loading...</div>;
	if (userError || lobbyError)
		return <div>Error: {userError?.message || lobbyError?.message}</div>;

	return (
		<div>
			<h1>Index Page</h1>
			<LobbyForm onSubmit={handleSubmit} />
		</div>
	);
};

export default IndexPage;
