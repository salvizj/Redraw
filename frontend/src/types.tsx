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
	Notification = 'notification',
	GameStarted = 'gameStarted',
}
export type FormData = {
	username: string
	lobbyId?: string
}
