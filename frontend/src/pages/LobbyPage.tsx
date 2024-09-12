import React, { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useLobbyContext } from "../context/lobbyContext"
import { useUserContext } from "../context/userContext"
import { useWebSocketContext } from "../context/webSocketContext"
import { useLobbyDetails } from "../hooks/useLobbyDetails"
import { useUserDetails } from "../hooks/useUserDetails"
import LobbyDetails from "../components/LobbyDetails"
import DisplayWsMessages from "../components/DisplayWsMessages"
import ErrorDisplay from "../components/utils/ErrorDisplay"
import LoadingLobby from "../components/LoadingLobby"
import { handleStartGame } from "../utils/handleStartGame"

const LobbyPage: React.FC = () => {
	const navigate = useNavigate()
	const connectionAttemptedRef = useRef(false)
	const { lobbyId, players, lobbySettings } = useLobbyContext()
	const { username, role, sessionId } = useUserContext()
	const [fetchError, setFetchError] = useState<string | null>(null)
	const {
		sendMessage,
		messages,
		shouldRefetchLobby,
		setShouldRefetchLobby,
		connectWebSocket,
		gameStarted,
		isConnected,
	} = useWebSocketContext()
	const {
		fetchDetails: fetchLobbyDetails,
		loading: loadingLobbyDetails,
		error: errorLobbyDetails,
	} = useLobbyDetails()
	const {
		fetchDetails: fetchUserDetails,
		loading: loadingUserDetails,
		error: errorUserDetails,
	} = useUserDetails()

	useEffect(() => {
		const fetchData = async () => {
			try {
				await fetchUserDetails()
				await fetchLobbyDetails()
			} catch (error) {
				setFetchError("Failed to fetch lobby or user details.")
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
					setFetchError("Failed to refetch lobby details.")
				}
			}
			refetchData()
		}
	}, [shouldRefetchLobby, fetchLobbyDetails, setShouldRefetchLobby])

	useEffect(() => {
		if (
			sessionId &&
			lobbyId &&
			!isConnected &&
			!connectionAttemptedRef.current
		) {
			connectWebSocket(sessionId, lobbyId)
			connectionAttemptedRef.current = true
		}
	}, [sessionId, lobbyId, isConnected, connectWebSocket])

	useEffect(() => {
		if (gameStarted) {
			navigate("/game")
		}
	}, [gameStarted, navigate])

	const onStartGame = () => {
		handleStartGame(sessionId, lobbyId, sendMessage)
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
				<LoadingLobby />
			) : displayError ? (
				<ErrorDisplay message={displayError} />
			) : lobbyId && username && lobbySettings && role ? (
				<LobbyDetails
					lobbyId={lobbyId}
					username={username}
					role={role}
					players={players}
					handleStartGame={onStartGame}
					loading={false}
					lobbySettings={lobbySettings}
					playerCount={players?.length || 0}
				/>
			) : (
				<p>No lobby joined.</p>
			)}
		</div>
	)
}

export default LobbyPage
