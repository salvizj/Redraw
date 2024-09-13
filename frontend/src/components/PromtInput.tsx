import React, { useState } from "react"
import { createPrompt } from "../api/createPromtApi"

const PromptInput: React.FC<{
	sessionId: string | null
	lobbyId: string | null
	username: string | null
	onPromptSent: () => void
}> = ({ sessionId, lobbyId, username, onPromptSent }) => {
	const [inputValue, setInputValue] = useState("")
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
	}

	const handleSubmit = async () => {
		if (!sessionId || !lobbyId || !username) {
			setError("Missing sessionId, lobbyId, or username.")
			return
		}

		setLoading(true)
		setError(null)

		try {
			await createPrompt({
				prompt: inputValue,
				sessionId,
				lobbyId,
				username,
			})
			setInputValue("")
			onPromptSent()
		} catch (error) {
			setError("Failed to submit prompt. Please try again.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="prompt-container">
			<input
				type="text"
				value={inputValue}
				onChange={handleInputChange}
				placeholder="Enter your prompt"
				disabled={loading}
				className="prompt-input"
			/>
			<button
				onClick={handleSubmit}
				disabled={loading}
				className="prompt-button"
			>
				{loading ? "Submitting..." : "Submit"}
			</button>
			{error && <p className="prompt-error">{error}</p>}
		</div>
	)
}
export default PromptInput
