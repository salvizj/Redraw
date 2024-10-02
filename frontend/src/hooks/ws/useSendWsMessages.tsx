import { useCallback } from "react";
import { useWebSocketContext } from "../../context/webSocketContext";
import { Message } from "../../types";

export const useSendWsMessages = () => {
  const { socketRef } = useWebSocketContext();

  const sendMessage = useCallback(
    (message: Message) => {
      if (socketRef && socketRef.readyState === WebSocket.OPEN) {
        socketRef.send(JSON.stringify(message));
      } else {
        console.warn("WebSocket is not open. Unable to send message.");
      }
    },
    [socketRef],
  );

  return { sendMessage };
};
