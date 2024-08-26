import React, { useEffect, useState } from 'react';
import { useLobbyContext } from '../context/lobbyContext';
import { useUserContext } from '../context/userContext';
import { useLobbyDetails } from '../hooks/useLobbyDetails';
import { useUserDetails } from '../hooks/useUserDetails';

const LobbyPage: React.FC = () => {
	const { lobbyId, players, setLobbyId, setPlayers } = useLobbyContext();
	const { username, role, setUsername, setRole } = useUserContext();
	const [copied, setCopied] = useState(false);
	const [copyError, setCopyError] = useState<string | null>(null);
	const [fetchError, setFetchError] = useState<string | null>(null);

	const {
		fetchDetails: fetchLobbyDetails,
		lobbyDetails,
		loading: loadingLobbyDetails,
		error: errorLobbyDetails,
	} = useLobbyDetails();

	const {
		fetchDetails: fetchUserDetails,
		userDetails,
		loading: loadingUserDetails,
		error: errorUserDetails,
	} = useUserDetails();

	useEffect(() => {
		const fetchData = async () => {
			try {
				await fetchUserDetails();
				await fetchLobbyDetails();
			} catch {
				setFetchError('Failed to fetch lobby or user details.');
			}
		};

		fetchData();
	}, [fetchUserDetails, fetchLobbyDetails]);

	useEffect(() => {
		if (userDetails && lobbyDetails) {
			setUsername(userDetails.username);
			setRole(userDetails.role);
			setLobbyId(lobbyDetails.lobbyId);
			setPlayers(lobbyDetails.players);
		}
	}, [
		userDetails,
		lobbyDetails,
		setUsername,
		setRole,
		setLobbyId,
		setPlayers,
	]);

	const handleCopyToClipboard = () => {
		if (lobbyId) {
			const BASE_URL = import.meta.env.VITE_BASE_URL;
			const url = `${BASE_URL}/?l=${lobbyId}`;
			navigator.clipboard
				.writeText(url)
				.then(() => {
					setCopied(true);
					setTimeout(() => setCopied(false), 2000);
					setCopyError(null);
				})
				.catch(() => {
					setCopyError('Failed to copy the text to clipboard.');
				});
		}
	};

	const handleStart = () => {};

	return (
		<div>
			<h1>Lobby Page</h1>
			{loadingUserDetails || loadingLobbyDetails ? (
				<p>Loading...</p>
			) : errorUserDetails || errorLobbyDetails || fetchError ? (
				<p style={{ color: 'red' }}>
					Error:{' '}
					{fetchError ||
						errorUserDetails?.message ||
						errorLobbyDetails?.message}
				</p>
			) : lobbyId ? (
				<div>
					<p>Lobby ID: {lobbyId}</p>
					<p>Username: {username}</p>
					<p>User Role: {role}</p>
					{players.length > 0 && (
						<div>
							<h2>Players in Lobby:</h2>
							<ul>
								{players.map((player) => (
									<li key={player.username}>
										{player.username} - {player.role}
									</li>
								))}
							</ul>
						</div>
					)}
					{copyError && <p style={{ color: 'red' }}>{copyError}</p>}
					<button onClick={handleCopyToClipboard}>
						Copy Lobby URL
					</button>
					{copied && (
						<p style={{ color: 'green' }}>Copied to clipboard!</p>
					)}
				</div>
			) : (
				<p>No lobby joined.</p>
			)}
			{role === 'leader' && <button onClick={handleStart}>Start</button>}
			{role === 'player' && <p>Wait for the leader to start the game</p>}
		</div>
	);
};

export default LobbyPage;
