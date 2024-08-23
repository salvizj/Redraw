import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLobbyContext } from '../context/LobbyContext';
import useUserRole from '../hooks/useUserRole';

const LobbyPage: React.FC = () => {
	const { lobbyId } = useLobbyContext();
	const { role, error } = useUserRole();
	const [copied, setCopied] = useState(false);
	const [ws, setWs] = useState<WebSocket | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (lobbyId) {
			const wsUrl = `${process.env.BASE_URL}/ws`;
			const socket = new WebSocket(wsUrl);

			socket.onopen = () => {
				console.log('Connected to WebSocket');
				socket.send(
					JSON.stringify({
						type: 'join-lobby',
						lobbyId: lobbyId,
					})
				);
			};

			socket.onmessage = (event) => {
				try {
					const message = JSON.parse(event.data);
					if (message.type === 'game-started') {
						navigate('/GamePage');
					}
				} catch (error) {
					console.error('Error parsing WebSocket message:', error);
				}
			};

			socket.onerror = (error) => {
				console.error('WebSocket error:', error);
			};

			socket.onclose = () => {
				console.log('WebSocket connection closed');
			};

			setWs(socket);

			return () => {
				if (socket.readyState === WebSocket.OPEN) {
					socket.close();
				}
			};
		}
	}, [lobbyId, navigate]);

	const handleCopyToClipboard = () => {
		if (lobbyId) {
			const baseUrl = process.env.BASE_URL; // Ensure BASE_URL is set correctly
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

	const handleStart = () => {
		if (ws && ws.readyState === WebSocket.OPEN) {
			ws.send(
				JSON.stringify({
					type: 'start-game',
					lobbyId: lobbyId,
				})
			);
		} else {
			console.warn('WebSocket is not open.');
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
			{role === 'leader' && <button onClick={handleStart}>Start</button>}
		</div>
	);
};

export default LobbyPage;
