import React, { useState } from 'react';
import { useLobby } from '../context/LobbyContext';

const LobbyPage: React.FC = () => {
	const { lobbyId } = useLobby();
	const [copied, setCopied] = useState(false);

	const handleCopyToClipboard = () => {
		if (lobbyId) {
			const url = `http://localhost:8080/?l=${lobbyId}`;
			navigator.clipboard
				.writeText(url)
				.then(() => {
					setCopied(true);
					setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
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
		</div>
	);
};

export default LobbyPage;
