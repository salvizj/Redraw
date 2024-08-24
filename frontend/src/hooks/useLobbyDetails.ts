import { useState, useEffect } from 'react';
import { fetchLobbyDetails } from '../api/getLobbyDetailsApi';
import { LobbyDetails } from '../types';

export const useLobbyDetails = () => {
	const [lobbyDetails, setLobbyDetails] = useState<LobbyDetails | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const getLobbyDetails = async () => {
			setLoading(true);
			try {
				const details = await fetchLobbyDetails();
				setLobbyDetails(details);
			} catch (err) {
				setError(err as Error);
			} finally {
				setLoading(false);
			}
		};

		getLobbyDetails();
	}, []);

	return { lobbyDetails, loading, error };
};
