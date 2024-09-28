import { useState, useCallback } from "react"
import { assignPrompt } from "../api/prompt/assignPromptApi"

export const usePromptAssignmentForLobby = () => {
	const [assignmentError, setAssignmentError] = useState<string | null>(null)
	const [assignmentResponse, setAssignmentResponse] = useState<string | null>(
		null
	)

	const assignPromptsToLobby = useCallback(async (lobbyId: string) => {
		setAssignmentError(null)
		setAssignmentResponse(null)
		try {
			const result = await assignPrompt({ lobbyId })
			if (result.message) {
				setAssignmentResponse(result.message)
			} else {
				setAssignmentError("Unexpected response format")
			}
		} catch (err) {
			setAssignmentError(
				err instanceof Error
					? err.message
					: "Failed to assign prompts to lobby"
			)
		}
	}, [])

	return {
		assignPromptsToLobby,
		assignmentError,
		assignmentResponse,
	}
}
