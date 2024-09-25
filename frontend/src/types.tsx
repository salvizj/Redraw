export type Player = {
  username: string;
  role: string;
};

export type LobbySettings = {
  LobbySettingsId: string;
  MaxPlayerCount: number;
  PromptInputTime: number;
  DrawingTime: number;
  LobbyStatus: LobbyStatus;
};

export type LobbyDetails = {
  lobbyId: string;
  players: Player[];
  role: string;
  username: string;
  lobbySettings: LobbySettings;
};

export enum LobbyStatus {
  StatusWaiting = "waiting",
  StatusActive = "active",
}

export type Message = {
  type: string;
  sessionId: string;
  lobbyId: string;
  data: any;
};

export enum MessageType {
  Join = "join",
  Leave = "leave",
  StartGame = "startGame",
  NavigateToGame = "navigateToGame",
  EnteredGame = "enteredGame",
  AssignPromptsComplete = "assignPromptsComplete",
  GotPrompt = "gotPrompt",
  SubmitedPrompt = "submitedPrompt",
  EditLobbySettings = "editLobbySettings",
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
