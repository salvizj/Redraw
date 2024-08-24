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
