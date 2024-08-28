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
	console.log(players)
	return (
		<div>
			<h1>Lobby Page</h1>
			{loadingUserDetails || loadingLobbyDetails ? (
				<p>Loading...</p>
			) : errorUserDetails || errorLobbyDetails || fetchError ? (
				<p style={{ color: 'red' }}>
					Error:{' '}
					{fetchError ||
						errorUserDetails?.message ||
						errorLobbyDetails?.message}
				</p>
			) : lobbyId ? (
				<div>
					<p>Lobby ID: {lobbyId}</p>
					<p>Username: {username}</p>
					<p>User Role: {role}</p>
					<PlayersInLobby players={players} />
					<HandleCopyToClipboard lobbyId={lobbyId} />
				</div>
			) : (
				<p>No lobby joined.</p>
			)}
			<StartButton handleStart={handleStart} role={role} />
			<div>
				<h2>Latest Message:</h2>
				<p>{message ? JSON.stringify(message) : 'No messages yet'}</p>
			</div>
		</div>
	)
}

export default LobbyPage
