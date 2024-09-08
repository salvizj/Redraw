import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLobbyContext } from '../context/lobbyContext'
import { useUserContext } from '../context/userContext'
import { useWebSocketContext } from '../context/webSocketContext'
import { useLobbyDetails } from '../hooks/useLobbyDetails'
import { useUserDetails } from '../hooks/useUserDetails'
import LobbyDetails from '../components/LobbyDetails'
import DisplayWsMessages from '../components/DisplayWsMessages'
import ErrorDisplay from '../components/ErrorDisplay'
import Loading from '../components/Loading'
import { MessageType, Message } from '../types'

const LobbyPage: React.FC = () => {
	const navigate = useNavigate()
	const { lobbyId, players, setPlayerCount, setLobbyId, setPlayers } =
		useLobbyContext()
	const { username, role, sessionId, setSessionId, setUsername, setRole } =
		useUserContext()
	const [fetchError, setFetchError] = React.useState<string | null>(null)
	const {
		setSessionID,
		setLobbyID,
		sendMessage,
		messages,
		shouldRefetchLobby,
		setShouldRefetchLobby,
	} = useWebSocketContext()
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
			} catch (error) {
				setFetchError('Failed to fetch lobby or user details.')
			}
		}
		fetchData()
	}, [fetchUserDetails, fetchLobbyDetails])

	useEffect(() => {
		if (shouldRefetchLobby) {
			const refetchData = async () => {
				try {
					await fetchLobbyDetails()
					setShouldRefetchLobby(false)
				} catch (error) {
					setFetchError('Failed to refetch lobby details.')
				}
			}
			refetchData()
		}
	}, [shouldRefetchLobby, fetchLobbyDetails, setShouldRefetchLobby])

	useEffect(() => {
		if (userDetails && lobbyDetails) {
			setSessionId(userDetails.sessionId)
			setUsername(userDetails.username)
			setRole(userDetails.role)
			setLobbyId(lobbyDetails.lobbyId)
			setPlayers(lobbyDetails.players)
			let playerCount = players.length
			setPlayerCount(playerCount)
		}
	}, [
		userDetails,
		lobbyDetails,
		setSessionId,
		setUsername,
		setRole,
		setLobbyId,
		setPlayers,
	])

	useEffect(() => {
		if (sessionId && lobbyId) {
			setSessionID(sessionId)
			setLobbyID(lobbyId)
		}
	}, [sessionId, setSessionID, lobbyId, setLobbyID])

	useEffect(() => {
		const handleNavigation = () => {
			const gameStartedMessage = messages.find(
				(msg) => msg.type === MessageType.NavigateToGame
			)
			if (gameStartedMessage) {
				navigate('/game')
			}
		}

		handleNavigation()
	}, [messages, navigate])

	const handleStartGame = () => {
		if (!sessionId || !lobbyId) {
			return
		}
		const startGameMessage: Message = {
			type: MessageType.StartGame,
			sessionId: sessionId!,
			lobbyId: lobbyId!,
			data: {},
		}
		sendMessage(startGameMessage)
	}

	const displayError =
		fetchError || errorUserDetails?.message || errorLobbyDetails?.message

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
			<h1 className="text-4xl font-bold mb-6 text-blue-400">
				Lobby Page
			</h1>
			<DisplayWsMessages messages={messages} />
			{loadingUserDetails || loadingLobbyDetails ? (
				<Loading />
			) : displayError ? (
				<ErrorDisplay message={displayError} />
			) : lobbyId && username && role ? (
				<LobbyDetails
					lobbyId={lobbyId}
					username={username}
					role={role}
					players={players}
					handleStartGame={handleStartGame}
					loading={false}
				/>
			) : (
				<p>No lobby joined.</p>
			)}
		</div>
	)
}

export default LobbyPage
