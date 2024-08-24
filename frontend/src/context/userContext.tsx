import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserContextType = {
	sessionId: string | null;
	username: string | null;
	role: string | null;
	setSessionId: (id: string | null) => void;
	setUsername: (username: string | null) => void;
	setRole: (role: string | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);
	const [role, setRole] = useState<string | null>(null);

	return (
		<UserContext.Provider
			value={{
				sessionId,
				username,
				role,
				setSessionId,
				setUsername,
				setRole,
			}}
		>
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
