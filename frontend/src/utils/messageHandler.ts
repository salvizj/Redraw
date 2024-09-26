import { Message, MessageType } from "../types";

export const createMessage = (
  type: MessageType,
  sessionId: string,
  lobbyId: string,
  data: any,
): Message => ({
  type,
  sessionId,
  lobbyId,
  data,
});

export const handleEnteredGameMessage = (
  sessionId: string,
  lobbyId: string,
  username: string,
  sendMessage: (message: Message) => void,
) => {
  sendMessage(
    createMessage(
      MessageType.EnteredGame,
      sessionId,
      lobbyId,
      `${username} has entered the game`,
    ),
  );
};

export const handleSubmittedPromptMessage = (
  sessionId: string,
  lobbyId: string,
  username: string,
  sendMessage: (message: Message) => void,
) => {
  sendMessage(
    createMessage(
      MessageType.SubmittedPrompt,
      sessionId,
      lobbyId,
      `${username} submitted prompt`,
    ),
  );
};

export const handleGotPromptMessage = (
  sessionId: string,
  lobbyId: string,
  username: string,
  sendMessage: (message: Message) => void,
) => {
  sendMessage(
    createMessage(
      MessageType.GotPrompt,
      sessionId,
      lobbyId,
      `${username} got prompt`,
    ),
  );
};

export const handleStartGame = (
  sessionId: string,
  lobbyId: string,
  username: string,
  sendMessage: (message: Message) => void,
) => {
  sendMessage(
    createMessage(
      MessageType.StartGame,
      sessionId,
      lobbyId,
      `${username} started game`,
    ),
  );
};

export const handleEditLobbySettings = (
  sessionId: string,
  lobbyId: string,
  username: string,
  sendMessage: (message: Message) => void,
) => {
  sendMessage(
    createMessage(
      MessageType.EditLobbySettings,
      sessionId,
      lobbyId,
      `${username} edited lobby settings`,
    ),
  );
};

export const handleAssignPromptsComplete = (
  sessionId: string,
  lobbyId: string,
  sendMessage: (message: Message) => void,
) => {
  sendMessage(
    createMessage(MessageType.AssignPromptsComplete, sessionId, lobbyId, {}),
  );
};

export const handleFinishedDrawingMessage = (
  sessionId: string,
  lobbyId: string,
  username: string,
  sendMessage: (message: Message) => void,
) => {
  sendMessage(
    createMessage(
      MessageType.FinishedDrawing,
      sessionId,
      lobbyId,
      `${username} finished drawing`,
    ),
  );
};
