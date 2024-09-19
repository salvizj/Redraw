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
import { useLanguage } from "../context/languageContext"

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

	const { language } = useLanguage()
	useEffect(() => {
		const fetchData = async () => {
			try {
				await fetchUserDetails()
				await fetchLobbyDetails()
			} catch (error) {
				setFetchError(
					language === "en"
						? "Failed to fetch lobby or user details."
						: "Neizdevās iegūt istabas vai lietotāja informāciju."
				)
			}
		}
		fetchData()
	}, [fetchUserDetails, fetchLobbyDetails, language])

	useEffect(() => {
		if (shouldRefetchLobby) {
			const refetchData = async () => {
				try {
					await fetchLobbyDetails()
				} catch (error) {
					setFetchError(
						language === "en"
							? "Failed to refetch lobby details."
							: "Neizdevās atkārtoti iegūt istabas informāciju."
					)
				} finally {
					setShouldRefetchLobby(false)
				}
			}
			refetchData()
		}
	}, [shouldRefetchLobby, fetchLobbyDetails, setShouldRefetchLobby, language])

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
		<div className="min-h-screen justify-center items-center">
			<h1 className="heading-primary">
				{language === "en" ? "Lobby Page" : "Istabas Lapa"}
			</h1>
			{loadingUserDetails || loadingLobbyDetails ? (
				<Loading
					messages={[
						language === "en"
							? "Connecting to the lobby..."
							: "Savienojas ar istabu...",
						language === "en"
							? "Gathering user details..."
							: "Vāc lietotāja informāciju...",
						language === "en"
							? "Almost there..."
							: "Gandrīz pabeigts...",
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
				<p>
					{language === "en"
						? "Failed to join lobby"
						: "Neizdevās pievienoties istabai"}
				</p>
			)}
		</div>
	)
}

export default LobbyPage
