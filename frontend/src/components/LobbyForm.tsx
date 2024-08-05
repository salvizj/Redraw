import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type LobbyFormProps = {
	onSubmit: (formData: { username: string; lobbyId?: string }) => void;
};

const LobbyForm: React.FC<LobbyFormProps> = ({ onSubmit }) => {
	const [username, setUsername] = useState('');
	const [lobbyId, setLobbyId] = useState<string | null>(null);
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
			<button type="submit">Start A Game</button>
		</form>
	);
};

export default LobbyForm;
