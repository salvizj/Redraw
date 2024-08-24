import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type LobbyFormProps = {
	onSubmit: (formData: { username: string; lobbyId?: string }) => void;
};

const LobbyForm: React.FC<LobbyFormProps> = ({ onSubmit }) => {
	const [username, setUsername] = useState('');
	const [lobbyId, setLobbyId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const location = useLocation();

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const lobbyIdFromUrl = queryParams.get('l');
		if (lobbyIdFromUrl) {
			setLobbyId(lobbyIdFromUrl);
		}
	}, [location.search]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		if (!username.trim()) {
			setError('Username cannot be empty.');
			return;
		}

		if (/<script|<\/script>/i.test(username)) {
			setError('Username cannot contain scripts.');
			return;
		}

		if (username.length > 20) {
			setError('Username cannot be longer than 20 characters.');
			return;
		}

		onSubmit({ username, lobbyId: lobbyId ?? undefined });
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="username">Username</label>
			<input
				type="text"
				value={username}
				onChange={handleChange}
				placeholder="Enter your username"
				name="username"
			/>
			<button type="submit">
				{lobbyId ? <>lobbyId: Join a Lobby</> : <>Create a lobby</>}
			</button>
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</form>
	);
};

export default LobbyForm;
