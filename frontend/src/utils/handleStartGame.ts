import { Message, MessageType } from "../types";

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
