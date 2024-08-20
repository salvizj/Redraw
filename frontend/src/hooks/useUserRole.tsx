import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { GetUserRole } from '../api/userRoleApi';

const useUserRole = () => {
	const [role, setRole] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserRole = async () => {
			const sessionId = Cookies.get('sessionId');
			if (sessionId) {
				try {
					const response = await GetUserRole({ sessionId });
					setRole(response.role);
					setError(null);
				} catch (err) {
					console.error('Error fetching user role:', err);
					setError('Failed to fetch user role.');
				}
			} else {
				setError('Session ID not found in cookies.');
			}
		};

		fetchUserRole();
	}, []);

	return { role, error };
};

export default useUserRole;
