export type Player = {
	username: string;
	role: string;
};
export type LobbyDetails = {
	lobbyId: string;
	players: Player[];
};

export type FormData = {
	username: string;
	lobbyId?: string;
};
export type UserDetails = {
	sessionId: string;
	lobbyId: string;
	role: string;
	username: string;
};
export type UserContextType = {
	username: string | null;
	sessionId: string | null;
	role: string | null;
	setSessionId: (sessionId: string | null) => void;
	setUsername: (username: string | null) => void;
	setRole: (role: string | null) => void;
};
export type LobbyContextType = {
	lobbyId: string | null;
	players: Player[];
	setLobbyId: (lobbyid: string | null) => void;
	setPlayers: (players: Player[]) => void;
};
export enum MessageType {
	Join = 'join',
	Leave = 'leave',
	StartGame = 'startGame',
	Notification = 'notification',
	GameStarted = 'gameStarted',
}

export type Message = {
	type: MessageType;
	sessionId?: string;
	lobbyId: string;
	data?: any;
};

export type WsApi = {
	connect: (sessionId: string, lobbyId: string) => void;
	disconnect: () => void;
	sendMessage: (msg: Message) => void;
	onMessage: (callback: (msg: Message) => void) => void;
};
