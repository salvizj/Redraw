import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

type FormData = {
	username: string
	lobbyId?: string
}

type LobbyFormProps = {
	onSubmit: (data: FormData) => void
}

const LobbyForm: React.FC<LobbyFormProps> = ({ onSubmit }) => {
	const [username, setUsername] = useState('')
	const [lobbyId, setLobbyId] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const location = useLocation()

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search)
		const lobbyIdFromUrl = queryParams.get('l')
		if (lobbyIdFromUrl) {
			setLobbyId(lobbyIdFromUrl)
		}
	}, [location.search])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value)
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (username) {
			onSubmit({ username, lobbyId: lobbyId || undefined })
		} else {
			setError('Username is required')
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
						required
						className="w-full mt-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</label>
			</div>
			{error && <p className="text-red-500 mb-4">{error}</p>}
			<button
				type="submit"
				className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
			>
				{lobbyId ? 'Join Lobby' : 'Create Lobby'}
			</button>
		</form>
	)
}

export default LobbyForm
