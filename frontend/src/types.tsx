export type Player = {
	username: string
	role: string
}

export type LobbyDetails = {
	lobbyId: string
	players: Player[]
	role: string
	username: string
}
export enum LobbyStatus {
	StatusWaiting = 'waiting',
	StatusActive = 'active',
}

export type LobbySettings = {
	lobbySettingsId: string
	playerCount: number
	maxPlayerCount: number
	status: LobbyStatus
	createdAt: string
}
export type Message = {
	type: string
	sessionId: string
	lobbyId: string
	data: any
}
export enum MessageType {
	Join = 'join',
	Leave = 'leave',
	StartGame = 'startGame',
	NavigateToGame = 'navigateToGame',
	Notification = 'notification',
	SyncPlayers = 'syncPlayers',
	AllPlayersSynced = 'allPlayersSynced',
	StartCountdown = 'startCountdown',
	SubmitPrompt = 'submitPrompt',
}

export type FormData = {
	username: string
	lobbyId?: string
}
