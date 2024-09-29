import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Message, WebSocketContextType } from "../types";

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const connectWebSocket = useCallback((sessionID: string, lobbyID: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.warn("WebSocket connection already open.");
      return;
    }
    const wsUrl = `${BASE_URL}/ws?sessionID=${sessionID}&lobbyID=${lobbyID}`;
    const ws = new WebSocket(wsUrl);

    ws.addEventListener("open", () => {
      setIsConnected(true);
    });

    ws.addEventListener("message", (event) => {
      try {
        const message: Message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);
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
        messages,
        isConnected,
        socket: socketRef.current,
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
