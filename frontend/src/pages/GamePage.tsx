import React, { useEffect, useState } from 'react'
import { useWebSocketContext } from '../context/webSocketContext'
import { useUserContext } from '../context/userContext'
import { useLobbyContext } from '../context/lobbyContext'
import Canvas from '../components/Canvas'
import { Message, MessageType } from '../types'

const GamePage: React.FC = () => {
	const { sendMessage, messages } = useWebSocketContext()
	const { sessionId, username } = useUserContext()
	const { lobbyId, players } = useLobbyContext()
	const [syncComplete, setSyncComplete] = useState(false)
	const [promptSent, setPromptSent] = useState(false)
	const [counter, setCounter] = useState(10)
	const [inputValue, setInputValue] = useState('')
	const [syncPlayerCount, setSyncPlayerCount] = useState(0)
	const [hasSentSyncMessage, setHasSentSyncMessage] = useState(false)
	useEffect(() => {
		if (sessionId && lobbyId && !hasSentSyncMessage) {
			const syncMessage: Message = {
				type: MessageType.SyncPlayers,
				sessionId: sessionId,
				lobbyId: lobbyId,
				data: { message: `${username} has entered the game` },
			}
			sendMessage(syncMessage)
			setHasSentSyncMessage(true)
		}
	}, [sendMessage, sessionId, lobbyId, username, hasSentSyncMessage])

	useEffect(() => {
		const syncPlayerMessages = messages.filter(
			(msg) => msg.type === MessageType.SyncPlayers
		)
		console.log('Filtered SyncPlayers messages:', syncPlayerMessages)

		const usernamesInMessages = syncPlayerMessages.map(
			(msg) => msg.data.message.split(' ')[0]
		)
		console.log('Usernames in SyncPlayers messages:', usernamesInMessages)

		usernamesInMessages.forEach((msgUsername) => {
			if (players.some((player) => player.username === msgUsername)) {
				console.log(`User ${msgUsername} found in players`)
				setSyncPlayerCount((prevCount) => prevCount + 1)
			} else {
				console.log(`User ${msgUsername} not found in players`)
			}
		})

		console.log('Current syncPlayerCount:', syncPlayerCount)
		console.log('Total players:', players.length)

		if (syncPlayerCount >= players.length) {
			console.log('All players synced')
			setSyncComplete(true)
		}
	}, [messages, players, syncPlayerCount, username])

	useEffect(() => {
		let countdownInterval: NodeJS.Timeout
		if (syncComplete) {
			countdownInterval = setInterval(() => {
				setCounter((prevCounter) =>
					prevCounter > 0 ? prevCounter - 1 : 0
				)
			}, 1000)
		}
		if (syncComplete && counter === 0) {
			setPromptSent(true)
		}
		return () => clearInterval(countdownInterval)
	}, [syncComplete, counter])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
	}

	const handleSubmit = () => {
		if (sessionId && lobbyId) {
			const submitPromptMessage: Message = {
				type: MessageType.SubmitPrompt,
				sessionId: sessionId,
				lobbyId: lobbyId,
				data: { prompt: inputValue },
			}
			sendMessage(submitPromptMessage)
		}
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
			<h1 className="text-4xl font-bold mb-6 text-blue-400">Game Page</h1>

			{syncComplete ? (
				<>
					<h2 className="text-2xl mb-4">
						Game starting in: {counter} seconds
					</h2>
					{counter === 0 && (
						<div className="flex flex-col items-center">
							<input
								type="text"
								value={inputValue}
								onChange={handleInputChange}
								placeholder="Enter your prompt"
								className="text-black p-2 mb-4"
							/>
							<button
								onClick={handleSubmit}
								className="bg-blue-500 text-white p-2 rounded"
							>
								Submit
							</button>
						</div>
					)}
				</>
			) : (
				<p className="text-xl">Waiting for all players to sync...</p>
			)}
			{promptSent ? <Canvas /> : <p>Error from server side</p>}
		</div>
	)
}

export default GamePage
