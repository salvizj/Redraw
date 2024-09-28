import { useEffect, useState, useCallback } from "react"
import { useWebSocketContext } from "../../context/webSocketContext"
import { Message, MessageType, GameState } from "../../types"

export const useGameStateChanges = (
	sessionId: string,
	lobbyId: string,
	username: string,
	setShouldRefetchLobbyDetails: (shouldRefetchLobbyDetails: boolean) => void
) => {
	const { messages } = useWebSocketContext()
	const [gameState, setGameState] = useState<GameState>(
		GameState.StatusWaitingForPlayers
	)

	const handleMessage = useCallback(
		(message: Message) => {
			if (
				message.type === MessageType.Join ||
				message.type === MessageType.EditLobbySettings
			) {
				setShouldRefetchLobbyDetails(true)
			}
			if (message.type === MessageType.GameStateChanges) {
				const newState: GameState = message.data

				if (Object.values(GameState).includes(newState)) {
					setGameState(newState)
				}
			}
		},
		[sessionId, lobbyId, username, messages]
	)

	useEffect(() => {
		const latestMessage = messages[messages.length - 1]
		if (latestMessage) {
			handleMessage(latestMessage)
		}
	}, [messages, handleMessage])

	return {
		gameState,
		setShouldRefetchLobbyDetails,
	}
}
