import React, { useEffect, useState } from 'react'
import { useLobbyContext } from '../context/lobbyContext'
import { useUserContext } from '../context/userContext'
import { useLobbyDetails } from '../hooks/useLobbyDetails'
import { useUserDetails } from '../hooks/useUserDetails'
import { useWebSocket } from '../hooks/useWebSocket'
import { MessageType } from '../types'
import PlayersInLobby from '../components/PlayersInLobby'
import StartButton from '../components/StartButton'
import HandleCopyToClipboard from '../components/HandleCopyToClipboard'

const LobbyPage: React.FC = () => {
	const { lobbyId, players, setLobbyId, setPlayers } = useLobbyContext()
	const { username, role, sessionId, setSessionId, setUsername, setRole } =
		useUserContext()
	const [fetchError, setFetchError] = useState<string | null>(null)
	const { message, sendMessage } = useWebSocket()

	const {
		fetchDetails: fetchLobbyDetails,
		lobbyDetails,
		loading: loadingLobbyDetails,
		error: errorLobbyDetails,
	} = useLobbyDetails()
	const {
		fetchDetails: fetchUserDetails,
		userDetails,
		loading: loadingUserDetails,
		error: errorUserDetails,
	} = useUserDetails()

	useEffect(() => {
		const fetchData = async () => {
			try {
				await fetchUserDetails()
				await fetchLobbyDetails()
			} catch {
				setFetchError('Failed to fetch lobby or user details.')
			}
		}
		fetchData()
	}, [fetchUserDetails, fetchLobbyDetails])

	useEffect(() => {
		if (userDetails && lobbyDetails) {
			setSessionId(userDetails.sessionId)
			setUsername(userDetails.username)
			setRole(userDetails.role)
			setLobbyId(lobbyDetails.lobbyId)
			setPlayers(lobbyDetails.players)

			if (lobbyDetails.lobbyId && userDetails.sessionId) {
				sendMessage(
					MessageType.Join,
					lobbyDetails.lobbyId,
					userDetails.sessionId
				)
			}
		}
	}, [
		userDetails,
		lobbyDetails,
		setSessionId,
		setUsername,
		setRole,
		setLobbyId,
		setPlayers,
		sendMessage,
	])

	const handleStart = () => {
		if (lobbyId && sessionId) {
			sendMessage(MessageType.StartGame, lobbyId, sessionId)
		}
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
			<h1 className="text-4xl font-bold mb-6 text-blue-400">
				Lobby Page
			</h1>
			{loadingUserDetails || loadingLobbyDetails ? (
				<p className="text-blue-300">Loading...</p>
			) : fetchError || errorUserDetails || errorLobbyDetails ? (
				<p className="text-red-500">
					Error:{' '}
					{fetchError ||
						errorUserDetails?.message ||
						errorLobbyDetails?.message}
				</p>
			) : lobbyId ? (
				<div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
					<p className="text-lg mb-2">Lobby ID: {lobbyId}</p>
					<p className="text-lg mb-2">Username: {username}</p>
					<p className="text-lg mb-4">User Role: {role}</p>
					<PlayersInLobby players={players} />
					<HandleCopyToClipboard lobbyId={lobbyId} />
					<StartButton handleStart={handleStart} role={role} />
					<div className="mt-4">
						<h2 className="text-xl font-semibold mb-2">
							Latest Message:
						</h2>
						<p>
							{message
								? JSON.stringify(message)
								: 'No messages yet'}
						</p>
					</div>
				</div>
			) : (
				<p>No lobby joined.</p>
			)}
		</div>
	)
}

export default LobbyPage
