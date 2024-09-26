export type Player = {
  username: string;
  role: string;
};

export type LobbySettings = {
  LobbySettingsId: string;
  MaxPlayerCount: number;
  PromptInputTime: number;
  DrawingTime: number;
};

export type LobbyDetails = {
  lobbyId: string;
  players: Player[];
  role: string;
  username: string;
  lobbySettings: LobbySettings;
};

export enum GameState {
  StatusWaitingForPlayers = "waitingForPlayers",
  StatusAllPlayersJoined = "allPlayersJoined",
  StatusTypingPrompts = "typingPrompts",
  StatusAllSubmittedPrompts = "allSubmittedPrompts",
  StatusAssigningPrompts = "assigningPrompts",
  StatusGettingPrompts = "gettingPrompts",
  StatusAllGotPrompts = "allGotPrompts",
  StatusAllFinishedDrawing = "allFinishedDrawing",
}

export type Message = {
  type: MessageType;
  sessionId: string;
  lobbyId: string;
  data: any;
};

export enum MessageType {
  Join = "join",
  Leave = "leave",
  StartGame = "startGame",
  EnteredGame = "enteredGame",
  AssignPromptsComplete = "assignPromptsComplete",
  GotPrompt = "gotPrompt",
  SubmittedPrompt = "submittedPrompt",
  EditLobbySettings = "editLobbySettings",
  FinishedDrawing = "finishedDrawing",
}

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
export type Prompt = {
  promptId: string;
  prompt: string;
  sessionId: string;
  lobbyId: string;
  username: string;
  assignedToSessionId: string;
};
