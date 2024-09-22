import React, { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { useWebSocketContext } from "../context/webSocketContext"
import { useUserContext } from "../context/userContext"
import { useLobbyContext } from "../context/lobbyContext"
import Canvas from "../components/canvas/Canvas"
import { MessageType } from "../types"
import { Countdown } from "../components/utils/Countdown"
import CanvasPromptForm from "../components/canvas/CanvasPromptForm"
import { getPrompt } from "../api/prompt/getPrompt"
import {
	handleEnteredGameMessage,
	handleSubmittedPromptMessage,
	handleGotPromptMessage,
} from "../utils/messageHandler"
import { useLanguage } from "../context/languageContext"

enum GameStage {
	WaitingForPlayers,
	AllPlayersJoined,
	EveryoneSubmittedPrompts,
	AssignedPromptsToPlayers,
	EveryoneGotPrompts,
	EveryoneStartedDrawing,
	EveryoneFinishedDrawing,
}

const GamePage: React.FC = () => {
	const { sendMessage, messages } = useWebSocketContext()
	const { sessionId, username } = useUserContext()
	const { lobbyId, players } = useLobbyContext()
	const { language } = useLanguage()

	const [gameStage, setGameStage] = useState<GameStage>(
		GameStage.WaitingForPlayers
	)
	const [prompt, setPrompt] = useState<string | null>(null)
	const [drawingComplete, setDrawingComplete] = useState(false)
	const [savingCanvasStatus, setSavingCanvasStatus] = useState(false)

	useEffect(() => {
		if (sessionId && lobbyId && username) {
			handleEnteredGameMessage(sessionId, lobbyId, username, sendMessage)
		}
	}, [sendMessage, sessionId, lobbyId, username])

	useEffect(() => {
		const syncEnteredGameMessages = messages.filter(
			(msg) => msg.type === MessageType.EnteredGame
		)
		const syncSubmittedPromptMessages = messages.filter(
			(msg) => msg.type === MessageType.SubmitedPrompt
		)
		const syncGotPromptMessages = messages.filter(
			(msg) => msg.type === MessageType.GotPrompt
		)

		if (syncEnteredGameMessages.length >= players.length) {
			setGameStage(GameStage.AllPlayersJoined)
		}

		if (syncSubmittedPromptMessages.length >= players.length) {
			setGameStage(GameStage.EveryoneSubmittedPrompts)

			// if (role === "leader"){
			//   //call func to assign prompts
			// }
			// then send some ws message to start getting promtps
		}

		if (syncGotPromptMessages.length >= players.length) {
			setGameStage(GameStage.EveryoneGotPrompts)
		}
	}, [messages, players])

	const handlePromptSubmit = () => {
		if (sessionId && lobbyId && username) {
			handleSubmittedPromptMessage(
				sessionId,
				lobbyId,
				username,
				sendMessage
			)
			setGameStage(GameStage.EveryoneSubmittedPrompts)
		}
	}

	useEffect(() => {
		if (
			gameStage === GameStage.EveryoneGotPrompts &&
			sessionId &&
			username &&
			lobbyId
		) {
			getPrompt({ sessionId, lobbyId })
				.then((response) => {
					setPrompt(response.data)
					handleGotPromptMessage(
						sessionId,
						lobbyId,
						username,
						sendMessage
					)
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
	}, [gameStage, sessionId, lobbyId, username, sendMessage, language])

	const renderGameStage = () => {
		switch (gameStage) {
			case GameStage.WaitingForPlayers:
				return (
					<p>
						{language === "en"
							? "Waiting for all players to enter the game..."
							: "Ģaidam, lai visi spēlētāji ienāk spēlē..."}
					</p>
				)
			case GameStage.AllPlayersJoined:
				return sessionId && username && lobbyId ? (
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
				) : (
					<p>{language === "en" ? "Loading..." : "Ielādē..."}</p>
				)
			case GameStage.EveryoneSubmittedPrompts:
				return (
					<p>
						{language === "en"
							? "Waiting for all players to receive their prompts..."
							: "Gaidam, lai visi spēlētāji saņem savus nosacījumus..."}
					</p>
				)
			case GameStage.EveryoneStartedDrawing:
				return (
					<>
						<Countdown
							text={
								language === "en"
									? "Seconds left to draw"
									: "Sekundes, lai zīmētu"
							}
							initialCounter={60}
							onCountdownComplete={() => setDrawingComplete(true)}
						/>
						<Canvas
							setSavingCanvasStatus={setSavingCanvasStatus}
							drawingComplete={drawingComplete}
							prompt={prompt}
							lobbyId={lobbyId}
						/>
					</>
				)
			case GameStage.EveryoneFinishedDrawing:
				return <Navigate to="/guessing" />
		}
	}

	useEffect(() => {
		if (drawingComplete && savingCanvasStatus && prompt) {
			setGameStage(GameStage.EveryoneFinishedDrawing)
		}
	}, [drawingComplete, savingCanvasStatus, prompt])

	return (
		<div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen flex flex-col items-center justify-center ">
			{renderGameStage()}
		</div>
	)
}

export default GamePage
