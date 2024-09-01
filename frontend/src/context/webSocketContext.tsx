import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

export enum MessageType {
  Join = "join",
  Leave = "leave",
  StartGame = "startGame",
  Notification = "notification",
  GameStarted = "gameStarted",
}

export type Message = {
  type: MessageType;
  sessionId: string;
  lobbyId: string;
  data: any;
};

interface WebSocketContextType {
  connect: () => void;
  sendMessage: (message: Message) => void;
  closeConnection: () => void;
  readMessages: (callback: (message: Message) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messageCallback, setMessageCallback] = useState<
    (message: Message) => void
  >(() => () => {});

  const connect = useCallback(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_BASE_URL);
    setSocket(ws);

    ws.onmessage = (event) => {
      try {
        const parsedMessage: Message = JSON.parse(event.data);
        if (messageCallback) {
          messageCallback(parsedMessage);
        }
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    };

    return () => {
      ws.close();
    };
  }, [messageCallback]);

  const sendMessage = (message: Message) => {
    if (socket) {
      socket.send(JSON.stringify(message));
    }
  };

  const closeConnection = () => {
    if (socket) {
      socket.close();
    }
  };

  const readMessages = (callback: (message: Message) => void) => {
    setMessageCallback(() => callback);
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  return (
    <WebSocketContext.Provider
      value={{ connect, sendMessage, closeConnection, readMessages }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
