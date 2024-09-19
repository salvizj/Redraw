import React, { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { useWebSocketContext } from "../context/webSocketContext"
import { useUserContext } from "../context/userContext"
import { useLobbyContext } from "../context/lobbyContext"
import Canvas from "../components/canvas/Canvas"
import { MessageType } from "../types"
import { Countdown } from "../components/utils/Countdown"
import CanvasPromptForm from "../components/canvas/CanvasPromptForm"
import { getPrompt } from "../api/getPromt"
import {
	handleEnteredGameMessage,
	handleSubmittedPromptMessage,
	handleGotPromptMessage,
} from "../utils/messageHandler"
import { useLanguage } from "../context/languageContext"
const GamePage: React.FC = () => {
	const { sendMessage, messages } = useWebSocketContext()
	const { sessionId, username } = useUserContext()
	const { lobbyId, players } = useLobbyContext()
	const { language } = useLanguage()
	const [enteredGameSyncComplete, setEnteredGameSyncComplete] =
		useState(false)
	const [submitedPromptSyncComplete, setSubmitedPromptSyncComplete] =
		useState(false)
	const [gotPromptSyncComplete, setGotPromptSyncComplete] = useState(false)

	const [hasSentEnteredGameMessage, setHasSentEnteredGameMessage] =
		useState(false)
	const [hasSentSubmitedPromptMessage, setHasSentSubmitedPromptMessage] =
		useState(false)
	const [hasSentGotPromptMessage, setHasSentGotPromptMessage] =
		useState(false)

	const [drawingComplete, setDrawingComplete] = useState(false)
	const [savingCanvasStatus, setSavingCanvasStatus] = useState(false)

	useEffect(() => {
		if (sessionId && lobbyId && username && !hasSentEnteredGameMessage) {
			handleEnteredGameMessage(sessionId, lobbyId, username, sendMessage)
			setHasSentEnteredGameMessage(true)
		}
	}, [sendMessage, sessionId, lobbyId, username, hasSentEnteredGameMessage])

	useEffect(() => {
		const syncEnteredGameMessages = messages.filter(
			(msg) => msg.type === MessageType.EnteredGame
		)
		const syncSubmitedPromptMessages = messages.filter(
			(msg) => msg.type === MessageType.SubmitedPrompt
		)
		const syncGotPromptMessages = messages.filter(
			(msg) => msg.type === MessageType.GotPrompt
		)

		const enteredPlayers = syncEnteredGameMessages.map(
			(msg) => msg.data.split(" ")[0]
		)
		const submittedPrompts = syncSubmitedPromptMessages.map(
			(msg) => msg.data.split(" ")[0]
		)
		const gotPrompts = syncGotPromptMessages.map(
			(msg) => msg.data.split(" ")[0]
		)

		if (enteredPlayers.length >= players.length) {
			setEnteredGameSyncComplete(true)
		}

		if (submittedPrompts.length >= players.length) {
			setSubmitedPromptSyncComplete(true)
		}

		if (gotPrompts.length >= players.length) {
			setGotPromptSyncComplete(true)
		}
	}, [messages, players])

	const handlePromptSubmit = () => {
		if (sessionId && lobbyId && username && !hasSentSubmitedPromptMessage) {
			handleSubmittedPromptMessage(
				sessionId,
				lobbyId,
				username,
				sendMessage
			)
			setHasSentSubmitedPromptMessage(true)
		}
	}

	useEffect(() => {
		if (
			submitedPromptSyncComplete &&
			!hasSentGotPromptMessage &&
			sessionId &&
			username &&
			lobbyId
		) {
			getPrompt({ sessionId, lobbyId })
				.then(() => {
					handleGotPromptMessage(
						sessionId,
						lobbyId,
						username,
						sendMessage
					)
					setHasSentGotPromptMessage(true)
				})
				.catch((error) =>
					console.error(
						language === "en"
							? "Error getting prompt:"
							: "Kļūda iugūstot nosacījumu",
						error
					)
				)
		}
	}, [
		submitedPromptSyncComplete,
		sessionId,
		lobbyId,
		sendMessage,
		hasSentGotPromptMessage,
	])

	const renderGameStage = () => {
		if (!enteredGameSyncComplete) {
			return (
				<p>
					{" "}
					{language === "en"
						? "Waiting for all players to enter the game..."
						: "Ģaidam, lai visi spēlētāji ienāk spēlē..."}
				</p>
			)
		}

		if (!submitedPromptSyncComplete && sessionId && username && lobbyId) {
			return (
				<>
					<CanvasPromptForm
						sessionId={sessionId}
						username={username}
						lobbyId={lobbyId}
						onPromptSent={handlePromptSubmit}
					/>
					<Countdown
						text={
							language === "en"
								? "Seconds left to submit your prompt"
								: "Sekundes, lai nosūtītu nosacījumu"
						}
						initialCounter={10}
						onCountdownComplete={handlePromptSubmit}
					/>
				</>
			)
		}

		if (!gotPromptSyncComplete) {
			return (
				<p>
					{language === "en"
						? "Waiting for all players to receive their prompts..."
						: "Gaidam, lai visi spēlētāji ienāk spēlē..."}
				</p>
			)
		}

		if (drawingComplete && savingCanvasStatus) {
			return <Navigate to="/showcase" />
		}

		return (
			<>
				<Countdown
					text="Seconds left to draw"
					initialCounter={60}
					onCountdownComplete={() => setDrawingComplete(true)}
				/>
				<Canvas
					setSavingCanvasStatus={setSavingCanvasStatus}
					drawingComplete={drawingComplete}
				/>
			</>
		)
	}

	return (
		<div className="page-container">
			<h1 className="heading-primary">
				{language === "en" ? "Game Page" : "Spēles Lapa"}
			</h1>
			{renderGameStage()}
		</div>
	)
}

export default GamePage
