import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import Cookies from 'js-cookie';
import { GetUserInfo } from '../api/userApi';

type UserContextType = {
	role: string | null;
	lobbyId: string | null;
	error: string | null;
	setLobbyId: (id: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [role, setRole] = useState<string | null>(null);
	const [lobbyId, setLobbyId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserInfo = async () => {
			const sessionId = Cookies.get('sessionId');
			if (sessionId) {
				try {
					const response = await GetUserInfo({ sessionId });
					setRole(response.role);
					setLobbyId(response.lobbyId);
					setError(null);
				} catch (err) {
					console.error('Error fetching user info:', err);
					setError('Failed to fetch user info.');
				}
			} else {
				setError('Session ID not found in cookies.');
			}
		};

		fetchUserInfo();
	}, []);

	return (
		<UserContext.Provider value={{ role, lobbyId, error, setLobbyId }}>
			{children}
		</UserContext.Provider>
	);
};

const useUserContext = (): UserContextType => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useUserContext must be used within a UserProvider');
	}
	return context;
};

export { UserProvider, useUserContext };
