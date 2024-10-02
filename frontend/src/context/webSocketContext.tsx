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
  const BASE_WS_URL = import.meta.env.VITE_BASE_WS_URL;
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const lobbyIdRef = useRef<string | null>(null);

  const connectWebSocket = useCallback(
    (sessionID: string, lobbyID: string) => {
      console.log(
        `[WS] Attempting to connect - Session ID: ${sessionID}, Lobby ID: ${lobbyID}`,
      );

      sessionIdRef.current = sessionID;
      lobbyIdRef.current = lobbyID;

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        console.log("[WS] WebSocket already connected and open");
        setIsOpen(true);
        setIsConnected(true);
        return;
      }

      if (socketRef.current) {
        console.log("[WS] Closing existing connection");
        socketRef.current.close();
        setIsOpen(false);
      }

      const wsUrl = `${BASE_WS_URL}/ws?sessionId=${sessionID}&lobbyId=${lobbyID}`;
      console.log(`[WS] Connecting to ${wsUrl}`);

      const ws = new WebSocket(wsUrl);

      ws.addEventListener("open", () => {
        console.log("[WS] Connection established successfully");
        setIsConnected(true);
        setIsOpen(true);
      });

      ws.addEventListener("message", (event) => {
        console.log("[WS] Message received:", event.data);
        try {
          const message: Message = JSON.parse(event.data);
          setMessages((prevMessages) => [...prevMessages, message]);
        } catch (error) {
          console.error("[WS] Error parsing message:", error);
        }
      });

      ws.addEventListener("close", (event) => {
        console.log(
          `[WS] Connection closed - Code: ${event.code}, Reason: ${event.reason}`,
        );
        setIsConnected(false);
        setIsOpen(false);

        if (event.code !== 1000 && sessionIdRef.current && lobbyIdRef.current) {
          console.log("[WS] Scheduling reconnection...");
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("[WS] Attempting to reconnect...");
            connectWebSocket(sessionIdRef.current!, lobbyIdRef.current!);
          }, 5000);
        }
      });

      ws.addEventListener("error", (error) => {
        console.error("[WS] WebSocket error:", error);
        setIsConnected(false);
        setIsOpen(false);
      });

      socketRef.current = ws;
    },
    [BASE_WS_URL],
  );

  const sendMessage = useCallback(
    (message: Message) => {
      if (socketRef.current && isOpen) {
        console.log("[WS] Sending message:", message);
        socketRef.current.send(JSON.stringify(message));
      } else {
        console.warn("[WS] Cannot send message - connection not open");
      }
    },
    [isOpen],
  );

  useEffect(() => {
    return () => {
      console.log("[WS] Cleaning up WebSocketProvider");
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close(1000, "Component unmounting");
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        socketRef: socketRef.current,
        connectWebSocket,
        sendMessage,
        isConnected,
        isOpen,
        messages,
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
