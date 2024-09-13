import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { createLobby, joinLobby } from "../api/submitLobbyFormApi"
import { checkUsernameExist } from "../api/checkUsernameExistApi"

const LobbyForm: React.FC = () => {
	const [username, setUsername] = useState("")
	const [lobbyId, setLobbyId] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search)
		const lobbyIdFromUrl = queryParams.get("l")
		if (lobbyIdFromUrl) {
			setLobbyId(lobbyIdFromUrl)
		}
	}, [location.search])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value)
		setError(null)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!username) {
			setError("Username is required")
			return
		}

		setLoading(true)
		setError(null)

		try {
			if (lobbyId) {
				const checkResponse = await checkUsernameExist({
					username,
					lobbyId,
				})

				if (checkResponse.exists) {
					setError(
						"Player with this username already exists in this lobby."
					)
					setLoading(false)
					return
				}

				await joinLobby({ username, lobbyId })
			} else {
				await createLobby({ username })
			}

			navigate("/lobby")
		} catch (error) {
			setError("Failed to submit the form or check username.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="form-container">
			<div className="mb-4">
				<label className="form-label">
					Username:
					<input
						type="text"
						value={username}
						onChange={handleChange}
						className="form-input"
					/>
				</label>
			</div>
			{error && <p className="form-error">{error}</p>}
			<button
				type="submit"
				className={`btn ${
					loading || error ? "btn-disabled" : "btn-primary"
				}`}
				disabled={loading || !!error}
			>
				{loading
					? "Checking..."
					: lobbyId
					? "Join Lobby"
					: "Create Lobby"}
			</button>
		</form>
	)
}

export default LobbyForm
