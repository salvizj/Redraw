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
	lobbyId: string;
	role: string;
	username: string;
};
export type UserContextType = {
	username: string | null;
	role: string | null;
	setUsername: (username: string | null) => void;
	setRole: (role: string | null) => void;
};
export type LobbyContextType = {
	lobbyId: string | null;
	players: Player[];
	setLobbyId: (lobbyid: string | null) => void;
	setPlayers: (players: Player[]) => void;
};
export type Message = {
	type: string;
	sessionId?: string;
	lobbyId: string;
	content?: string;
};

export type WsApi = {
	connect: (sessionId: string, lobbyId: string) => void;
	disconnect: () => void;
	sendMessage: (msg: Message) => void;
	onMessage: (callback: (msg: Message) => void) => void;
};
