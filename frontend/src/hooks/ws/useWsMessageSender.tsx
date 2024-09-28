import { useSendWsMessages } from "../ws/useSendWsMessages" // Adjust the import path as necessary
import { Message, MessageType } from "../../types" // Adjust the import path as necessary

// Create a message structure
export const createMessage = (
	type: MessageType,
	sessionId: string,
	lobbyId: string,
	data: any
): Message => ({
	type,
	sessionId,
	lobbyId,
	data,
})

// Custom hook for sending WebSocket messages
export const useWsMessageSender = (
	username: string,
	sessionId: string,
	lobbyId: string
) => {
	const { sendMessage } = useSendWsMessages()

	const handleJoinGameMessage = () => {
		sendMessage(
			createMessage(
				MessageType.Join,
				sessionId,
				lobbyId,
				`${username} has entered the game`
			)
		)
	}

	const handleSubmittedPromptMessage = () => {
		sendMessage(
			createMessage(
				MessageType.SubmittedPrompt,
				sessionId,
				lobbyId,
				`${username} submitted prompt`
			)
		)
	}

	const handleGotPromptMessage = () => {
		sendMessage(
			createMessage(
				MessageType.GotPrompt,
				sessionId,
				lobbyId,
				`${username} got prompt`
			)
		)
	}

	const handleStartGame = () => {
		sendMessage(
			createMessage(
				MessageType.StartGame,
				sessionId,
				lobbyId,
				`${username} started game`
			)
		)
	}

	const handleEditLobbySettings = () => {
		sendMessage(
			createMessage(
				MessageType.EditLobbySettings,
				sessionId,
				lobbyId,
				`${username} edited lobby settings`
			)
		)
	}

	const handleAssignPromptsComplete = () => {
		sendMessage(
			createMessage(
				MessageType.AssignPromptsComplete,
				sessionId,
				lobbyId,
				{}
			)
		)
	}

	const handleFinishedDrawingMessage = () => {
		sendMessage(
			createMessage(
				MessageType.SubmittedDrawing,
				sessionId,
				lobbyId,
				`${username} finished drawing`
			)
		)
	}

	return {
		handleJoinGameMessage,
		handleSubmittedPromptMessage,
		handleGotPromptMessage,
		handleStartGame,
		handleEditLobbySettings,
		handleAssignPromptsComplete,
		handleFinishedDrawingMessage,
	}
}
