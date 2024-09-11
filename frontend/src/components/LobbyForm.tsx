import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createLobby, joinLobby } from '../api/submitLobbyFormApi'
import { checkUsernameExist } from '../api/checkUsernameExistApi'

const LobbyForm: React.FC = () => {
	const [username, setUsername] = useState('')
	const [lobbyId, setLobbyId] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search)
		const lobbyIdFromUrl = queryParams.get('l')
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
			setError('Username is required')
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
						'Player with this sername already exists in this lobby.'
					)
					setLoading(false)
					return
				}

				await joinLobby({ username, lobbyId })
			} else {
				await createLobby({ username })
			}

			navigate('/lobby')
		} catch (error) {
			setError('Failed to submit the form or check username.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-gray-700 p-6 rounded-lg shadow-md max-w-sm mx-auto"
		>
			<div className="mb-4">
				<label className="block text-gray-200 text-sm font-semibold mb-2">
					Username:
					<input
						type="text"
						value={username}
						onChange={handleChange}
						className="w-full mt-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</label>
			</div>
			{error && <p className="text-red-500 mb-4">{error}</p>}
			<button
				type="submit"
				className={`w-full py-2 px-4 ${
					loading || error
						? 'bg-gray-500 cursor-not-allowed'
						: 'bg-blue-500 hover:bg-blue-600'
				} text-white rounded-lg shadow-md transition`}
				disabled={loading || !!error}
			>
				{loading
					? 'Checking...'
					: lobbyId
					? 'Join Lobby'
					: 'Create Lobby'}
			</button>
		</form>
	)
}

export default LobbyForm
