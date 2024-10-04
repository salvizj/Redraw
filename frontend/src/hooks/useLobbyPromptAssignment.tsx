import { useState, useCallback } from "react"
import { assignPrompt } from "../api/prompt/assignPromptApi"

export const useLobbyPromptAssignment = () => {
	const [assignPromptsError, setAssignPromptsError] = useState<string | null>(
		null
	)
	const [assignPromptsResponseStatus, setAssignPromptsResponseStatus] =
		useState<boolean>(false)

	const assignPromptsToLobby = useCallback(async (lobbyId: string) => {
		setAssignPromptsError(null)

		try {
			console.log("Calling assignPrompt API...")
			const result = await assignPrompt({ lobbyId })
			console.log("API response:", result)

			if (result.status === "success") {
				console.log("Successfully assigned prompts to lobby")
				setAssignPromptsResponseStatus(true)
			} else {
				console.error("Unexpected API response format:", result)
				setAssignPromptsError("Unexpected response format")
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Failed to assign prompts to lobby"
			console.error("Error assigning prompts:", errorMessage, err)
			setAssignPromptsError(errorMessage)
		}
	}, [])

	return {
		assignPromptsToLobby,
		assignPromptsError,
		assignPromptsResponseStatus,
	}
}
