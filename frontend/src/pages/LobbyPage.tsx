import React, { useState } from 'react';
import { useLobbyContext } from '../context/LobbyContext';
import useUserRole from '../hooks/useUserRole';

const LobbyPage: React.FC = () => {
	const { lobbyId } = useLobbyContext();
	const { role, error } = useUserRole();
	const [copied, setCopied] = useState(false);

	const handleCopyToClipboard = () => {
		if (lobbyId) {
			const baseUrl = process.env.BASE_URL;
			const url = `${baseUrl}/?l=${lobbyId}`;
			navigator.clipboard
				.writeText(url)
				.then(() => {
					setCopied(true);
					setTimeout(() => setCopied(false), 2000);
				})
				.catch((err) => {
					console.error('Failed to copy the text to clipboard:', err);
				});
		}
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
				</div>
			) : (
				<p>No lobby joined.</p>
			)}
			{role === 'leader' && <button>Start</button>}
		</div>
	);
};

export default LobbyPage;
