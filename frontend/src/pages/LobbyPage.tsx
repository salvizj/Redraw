import React, { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useLobbyContext } from "../context/lobbyContext"
import { useUserContext } from "../context/userContext"
import { useWebSocketContext } from "../context/webSocketContext"
import { useLobbyDetails } from "../hooks/useLobbyDetails"
import { useUserDetails } from "../hooks/useUserDetails"
import Error from "../components/utils/Error"
import Loading from "../components/utils/Loading"
import { handleStartGame } from "../utils/messageHandler"
import LobbyPlayers from "../components/lobby/LobbyPlayers"
import LobbyIdSection from "../components/lobby/LobbyIdSection"
import LobbyStartButton from "../components/lobby/LobbyStartButton"
import LobbySettings from "../components/lobby/LobbySettings"

const LobbyPage: React.FC = () => {
	const navigate = useNavigate()
	const connectionAttemptedRef = useRef(false)
	const { lobbyId, players, lobbySettings } = useLobbyContext()
	const { username, role, sessionId } = useUserContext()
	const [fetchError, setFetchError] = useState<string | null>(null)
	const {
		sendMessage,
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
				} catch (error) {
					setFetchError("Failed to refetch lobby details.")
				} finally {
					setShouldRefetchLobby(false)
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
		<div>
			{loadingUserDetails || loadingLobbyDetails ? (
				<Loading
					messages={[
						"Connecting to the lobby...",
						"Gathering user details...",
						"Almost there...",
					]}
				/>
			) : displayError ? (
				<Error message={displayError} />
			) : lobbyId && username && sessionId && lobbySettings && role ? (
				<>
					<LobbyIdSection lobbyId={lobbyId} />
					<div className="flex flex-row justify-between items-start gap-4">
						<div className="w-1/2">
							<LobbyPlayers players={players} />
						</div>
						<div className="w-1/2">
							<LobbySettings
								playerCount={players.length}
								lobbyId={lobbyId}
								username={username}
								role={role}
								lobbySettings={lobbySettings}
								sessionId={sessionId}
							/>
						</div>
					</div>

					<LobbyStartButton
						role={role}
						playerCount={players.length}
						handleStart={onStartGame}
					/>
				</>
			) : (
				<p>No lobby joined.</p>
			)}
		</div>
	)
}

export default LobbyPage
