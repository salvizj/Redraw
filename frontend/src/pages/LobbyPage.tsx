import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLobbyContext } from '../context/LobbyContext';
import useUserRole from '../hooks/useUserRole';

const LobbyPage: React.FC = () => {
	const { lobbyId } = useLobbyContext();
	const { role, error } = useUserRole();
	const [copied, setCopied] = useState(false);
	const [copyError, setCopyError] = useState<string | null>(null);
	const navigate = useNavigate();

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
				.catch((err) => {
					setCopyError('Failed to copy the text to clipboard.');
					console.error('Failed to copy the text to clipboard:', err);
				});
		}
	};

	const handleStart = () => {
		navigate('/GamePage');
	};

	return (
		<div>
			<h1>Lobby Page</h1>
			{lobbyId ? (
				<div>
					<p>Lobby ID: {lobbyId}</p>
					{role && <p>User Role: {role}</p>}
					{error && <p style={{ color: 'red' }}>{error}</p>}
					<button onClick={handleCopyToClipboard}>
						Copy Lobby URL
					</button>
					{copied && (
						<p style={{ color: 'green' }}>Copied to clipboard!</p>
					)}
					{copyError && <p style={{ color: 'red' }}>{copyError}</p>}
				</div>
			) : (
				<p>No lobby joined.</p>
			)}
			{role === 'leader' && <button onClick={handleStart}>Start</button>}
			{role === 'player' && <p> Wait for leader to start a game </p>}
		</div>
	);
};

export default LobbyPage;
