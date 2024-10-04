export type Player = {
	username: string
	role: string
}

export type LobbySettings = {
	lobbySettingsId: string
	maxPlayerCount: number
	promptInputTime: number
	drawingTime: number
}

export type LobbyDetails = {
	lobbyId: string
	players: Player[]
	role: string
	username: string
	lobbySettings: LobbySettings
}

export enum GameState {
	StatusWaitingForPlayers = "waitingForPlayers",
	StatusTypingPrompts = "typingPrompts",
	StatusAssigningPrompts = "assigningPrompts",
	StatusGettingPrompts = "gettingPrompts",
	StatusDrawing = "drawing",
	StatusGameFinished = "gameFinished",
}

export type Message = {
	type: MessageType
	sessionId: string
	lobbyId: string
	data: any
}

export enum MessageType {
	Join = "join",
	StartGame = "startGame",
	AssignPromptsComplete = "assignPromptsComplete",
	GotPrompt = "gotPrompt",
	SubmittedPrompt = "submittedPrompt",
	EditLobbySettings = "editedLobbySettings",
	SubmittedDrawing = "SubmittedDrawing",
	GameStateChanges = "gameStateChanges",
}

export type FormData = {
	username: string
	lobbyId?: string
}

export type UserDetails = {
	sessionId: string
	lobbyId: string
	role: string
	username: string
}
export type Prompt = {
	promptId: string
	prompt: string
	sessionId: string
	lobbyId: string
	username: string
	assignedToSessionId: string
}
export type WebSocketContextType = {
	connectWebSocket: (sessionID: string, lobbyID: string) => void
	sendMessage: (message: Message) => void
	messages: Message[]
	isConnected: boolean
	isOpen: boolean
	socketRef: WebSocket | null
}
export type UserContextType = {
	username: string
	sessionId: string
	role: string
	setSessionId: (sessionId: string) => void
	setUsername: (username: string) => void
	setRole: (role: string) => void
}

export type LobbyContextType = {
	lobbyId: string
	playerCount: number
	players: Player[]
	lobbySettings: LobbySettings | null
	setLobbyId: (lobbyId: string) => void
	setPlayerCount: (playerCount: number) => void
	setPlayers: (players: Player[]) => void
	setLobbySettings: (settings: LobbySettings | null) => void
}
export type GameStateContextType = {
	gameState: GameState
	setGameState: (gameState: GameState) => void
	shouldRefetchLobbyDetails: boolean
	setShouldRefetchLobbyDetails: (shouldRefetchLobbyDetails: boolean) => void
}
export type CanvasProps = {
	lobbyId: string | null
	prompt: string | null
	setSavingCanvasStatus: (savingCanvasStatus: boolean) => void
	drawingComplete: boolean
}
export type FetchPromptParams = {
	setPrompt: (prompt: string | null) => void
	setPromptId: (promptId: string | null) => void
}
export type LobbySettingsProps = {
	sessionId: string
	lobbyId: string
	username: string
	role: string
	lobbySettings: LobbySettings
	playerCount: number
}
export type LobbySettingsDisplayProps = {
	role: string
	isEditing: boolean
	setIsEditing: (isEditing: boolean) => void
	maxPlayerCount: number
	setMaxPlayerCount: (count: number) => void
	promptInputTime: number
	setPromptInputTime: (time: number) => void
	drawingTime: number
	setDrawingTime: (time: number) => void
	handleUpdateClick: () => void
	error: string | null
	lobbySettings: LobbySettings
}
