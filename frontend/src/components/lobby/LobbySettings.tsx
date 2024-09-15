import React, { useEffect, useState } from "react"
import {
	LobbySettings as LobbySettingsType,
	Message,
	MessageType,
} from "../../types"
import { editLobbySettings } from "../../api/editLobbySettingsApi"
import { useWebSocketContext } from "../../context/webSocketContext"
import LobbySettingsDisplay from "./LobbySettingsDisplay"

type LobbySettingsProps = {
	sessionId: string
	lobbyId: string
	username: string
	role: string
	lobbySettings: LobbySettingsType
	playerCount: number
}

const LobbySettings: React.FC<LobbySettingsProps> = ({
	sessionId,
	lobbyId,
	username,
	role,
	lobbySettings,
	playerCount,
}) => {
	const { sendMessage, messages, setShouldRefetchLobby, shouldRefetchLobby } =
		useWebSocketContext()
	const [maxPlayerCount, setMaxPlayerCount] = useState(
		lobbySettings.MaxPlayerCount
	)
	const [promptInputTime, setPromptInputTime] = useState(
		lobbySettings.PromtInputTime
	)
	const [drawingTime, setDrawingTime] = useState(lobbySettings.DrawingTime)
	const [error, setError] = useState<string | null>(null)
	const [isEditing, setIsEditing] = useState(false)
	const [
		hasSentRefetchLobbyDetailsMessage,
		setHasSentRefetchLobbyDetailsMessage,
	] = useState(false)

	useEffect(() => {
		const hasRefetchMessage = messages.some(
			(msg) => msg.type === MessageType.RefetchLobbyDetails
		)
		if (hasRefetchMessage && !shouldRefetchLobby) {
			setShouldRefetchLobby(true)
		}
	}, [messages, setShouldRefetchLobby])

	const handleUpdateClick = async () => {
		if (playerCount > maxPlayerCount) {
			setError(
				"Current player count exceeds the selected maximum player count."
			)
			return
		}

		try {
			await editLobbySettings({
				LobbySettingsId: lobbySettings.LobbySettingsId,
				MaxPlayerCount: maxPlayerCount,
				PromtInputTime: promptInputTime,
				DrawingTime: drawingTime,
				LobbyStatus: lobbySettings.LobbyStatus,
			})

			if (!hasSentRefetchLobbyDetailsMessage) {
				const refetchLobbyDetails: Message = {
					type: MessageType.RefetchLobbyDetails,
					sessionId: sessionId,
					lobbyId: lobbyId,
					data: username,
				}
				setHasSentRefetchLobbyDetailsMessage(true)
				sendMessage(refetchLobbyDetails)
			}

			setError(null)
			setIsEditing(false)
		} catch (err) {
			setError("Failed to edit lobby settings.")
		}
	}

	return (
		<LobbySettingsDisplay
			role={role}
			isEditing={isEditing}
			setIsEditing={setIsEditing}
			maxPlayerCount={maxPlayerCount}
			setMaxPlayerCount={setMaxPlayerCount}
			promptInputTime={promptInputTime}
			setPromptInputTime={setPromptInputTime}
			drawingTime={drawingTime}
			setDrawingTime={setDrawingTime}
			handleUpdateClick={handleUpdateClick}
			error={error}
			lobbySettings={lobbySettings}
		/>
	)
}

export default LobbySettings
