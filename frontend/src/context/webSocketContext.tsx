import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Message, MessageType } from "../types";

type WebSocketContextType = {
  connectWebSocket: (sessionID: string, lobbyID: string) => void;
  sendMessage: (message: Message) => void;
  messages: Message[];
  isConnected: boolean;
  shouldRefetchLobby: boolean;
  gameStarted: boolean;
  setShouldRefetchLobby: (value: boolean) => void;
  setGameStarted: (value: boolean) => void;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [shouldRefetchLobby, setShouldRefetchLobby] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const connectWebSocket = useCallback((sessionID: string, lobbyID: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.warn("WebSocket connection already open.");
      return;
    }

    const wsUrl = `${BASE_URL}/ws?sessionID=${sessionID}&lobbyID=${lobbyID}`;
    const ws = new WebSocket(wsUrl);

    ws.addEventListener("open", () => {
      setIsConnected(true);
      const message: Message = {
        type: MessageType.Join,
        sessionId: sessionID,
        lobbyId: lobbyID,
        data: null,
      };
      ws.send(JSON.stringify(message));
    });

    ws.addEventListener("message", (event) => {
      try {
        const message: Message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);
        if (message.type === MessageType.Join) {
          setShouldRefetchLobby(true);
        }
        if (message.type === MessageType.NavigateToGame) {
          setShouldRefetchLobby(true);
          setGameStarted(true);
        }
        if (message.type === MessageType.EditLobbySettings) {
          setShouldRefetchLobby(true);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    ws.addEventListener("close", (event) => {
      setIsConnected(false);
      console.warn(
        `WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}, Was Clean: ${event.wasClean}`,
      );
      if (event.code !== 1000) {
        console.warn("Attempting to reconnect...");
        reconnectTimeoutRef.current = setTimeout(
          () => connectWebSocket(sessionID, lobbyID),
          5000,
        );
      }
    });

    ws.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    });

    socketRef.current = ws;
  }, []);

  const sendMessage = (message: Message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not open. Unable to send message.");
    }
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        connectWebSocket,
        sendMessage,
        messages,
        isConnected,
        shouldRefetchLobby,
        setShouldRefetchLobby,
        setGameStarted,
        gameStarted,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider",
    );
  }
  return context;
};
