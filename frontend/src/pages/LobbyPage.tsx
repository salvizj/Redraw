import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLobbyContext } from "../context/lobbyContext"
import { useUserContext } from "../context/userContext"
import { useWebSocketContext } from "../context/webSocketContext"
import { useLanguage } from "../context/languageContext"
import Loading from "../components/utils/Loading"
import LobbyPlayers from "../components/lobby/LobbyPlayers"
import LobbyIdSection from "../components/lobby/LobbyIdSection"
import LobbyStartButton from "../components/lobby/LobbyStartButton"
import LobbySettings from "../components/lobby/LobbySettings"
import ErrorMessage from "../components/utils/ErrorMessage"
import { useGameStateChanges } from "../hooks/ws/useGameStateChanges"
import { useWsMessageSender } from "../hooks/ws/useWsMessageSender"
import { GameState } from "../types"
import useFetchLobbyAndUserDetails from "../hooks/useFetchLobbyAndUserDetails"

const LobbyPage: React.FC = () => {
	const navigate = useNavigate()
	const { lobbyId, players, lobbySettings } = useLobbyContext()
	const { username, role, sessionId } = useUserContext()
	const { connectWebSocket, socket, isConnected } = useWebSocketContext()
	const { language } = useLanguage()

	const { handleJoinGameMessage, handleStartGame } = useWsMessageSender(
		username,
		sessionId,
		lobbyId
	)

	const [shouldRefetchLobbyDetails, setShouldRefetchLobbyDetail] =
		useState(false)

	const { gameState } = useGameStateChanges(
		sessionId,
		lobbyId,
		username,
		setShouldRefetchLobbyDetail
	)

	const { isLoading, error } = useFetchLobbyAndUserDetails()

	useEffect(() => {
		if (sessionId && lobbyId && !isConnected && !socket) {
			connectWebSocket(sessionId, lobbyId)
			handleJoinGameMessage()
		}

		if (shouldRefetchLobbyDetails) {
			useFetchLobbyAndUserDetails()
			setShouldRefetchLobbyDetail(false)
		}

		if (gameState === GameState.StatusStartGame) {
			navigate("/game")
		}
	}, [
		sessionId,
		lobbyId,
		isConnected,
		language,
		shouldRefetchLobbyDetails,
		gameState,
	])

	if (isLoading) {
		return (
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
		)
	}

	if (error) {
		return <ErrorMessage message={error} />
	}

	if (!lobbyId || !username || !sessionId || !lobbySettings || !role) {
		return (
			<p>
				{language === "en"
					? "Failed to join lobby"
					: "Neizdevās pievienoties istabai"}
			</p>
		)
	}

	return (
		<div className="min-h-screen flex flex-col justify-center items-center">
			<LobbyIdSection lobbyId={lobbyId} />
			<div className="flex flex-row justify-between items-start gap-4 w-full">
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
				handleStart={handleStartGame}
			/>
		</div>
	)
}

export default LobbyPage
