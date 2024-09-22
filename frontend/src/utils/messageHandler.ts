import { Message, MessageType } from "../types";

export const handleEnteredGameMessage = (
  sessionId: string | null,
  lobbyId: string | null,
  username: string,
  sendMessage: (message: Message) => void,
) => {
  if (!sessionId || !lobbyId) {
    return;
  }

  const enteredGameMessage: Message = {
    type: MessageType.EnteredGame,
    sessionId: sessionId!,
    lobbyId: lobbyId!,
    data: `${username} has entered the game`,
  };

  sendMessage(enteredGameMessage);
};

export const handleSubmittedPromptMessage = (
  sessionId: string | null,
  lobbyId: string | null,
  username: string,
  sendMessage: (message: Message) => void,
) => {
  if (!sessionId || !lobbyId) {
    return;
  }

  const submittedPromptMessage: Message = {
    type: MessageType.SubmitedPrompt,
    sessionId: sessionId!,
    lobbyId: lobbyId!,
    data: username,
  };

  sendMessage(submittedPromptMessage);
};

export const handleGotPromptMessage = (
  sessionId: string | null,
  lobbyId: string | null,
  username: string,
  sendMessage: (message: Message) => void,
) => {
  if (!sessionId || !lobbyId) {
    return;
  }

  const gotPromptMessage: Message = {
    type: MessageType.GotPrompt,
    sessionId: sessionId!,
    lobbyId: lobbyId!,
    data: username,
  };

  sendMessage(gotPromptMessage);
};
export const handleStartGame = (
  sessionId: string | null,
  lobbyId: string | null,
  sendMessage: (message: Message) => void,
) => {
  if (!sessionId || !lobbyId) {
    return;
  }

  const startGameMessage: Message = {
    type: MessageType.StartGame,
    sessionId: sessionId!,
    lobbyId: lobbyId!,
    data: {},
  };

  sendMessage(startGameMessage);
};
export const handleEditLobbySettings = (
  sessionId: string | null,
  lobbyId: string | null,
  username: string,
  sendMessage: (message: Message) => void,
) => {
  if (!sessionId || !lobbyId) {
    return;
  }

  const editLobbySettingsMessage: Message = {
    type: MessageType.EditLobbySettings,
    sessionId: sessionId!,
    lobbyId: lobbyId!,
    data: username,
  };

  sendMessage(editLobbySettingsMessage);
};
