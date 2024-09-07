import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
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
  socket: WebSocket | null;
  setSessionID: (sessionID: string) => void;
  setLobbyID: (lobbyID: string) => void;
  sendMessage: (message: Message) => void;
  messages: Message[];
  isConnected: boolean;
  shouldRefetchLobby: boolean;
  setShouldRefetchLobby: (value: boolean) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [sessionID, setSessionID] = useState<string | null>(null);
  const [lobbyID, setLobbyID] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [shouldRefetchLobby, setShouldRefetchLobby] = useState<boolean>(false);

  useEffect(() => {
    if (!sessionID || !lobbyID) return;

    const wsUrl = `ws://localhost:8080/ws?sessionID=${sessionID}&lobbyID=${lobbyID}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(
        `WebSocket connection opened for sessionID: ${sessionID} and lobbyID: ${lobbyID}`,
      );
      setIsConnected(true);

      const message: Message = {
        type: MessageType.Join,
        sessionId: sessionID,
        lobbyId: lobbyID,
        data: "Joined",
      };
      console.log("Sending join message:", message);
      ws.send(JSON.stringify(message));
    };

    ws.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      console.log("Message received:", message);
      setMessages((prevMessages) => [...prevMessages, message]);

      if (
        message.type === MessageType.Join ||
        message.type === MessageType.GameStarted
      ) {
        setShouldRefetchLobby(true);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    setSocket(ws);

    return () => {
      ws.close();
      setSocket(null);
      setIsConnected(false);
    };
  }, [sessionID, lobbyID]);

  const sendMessage = (message: Message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("Sending message:", message);
      socket.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not open. Unable to send message.");
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        setSessionID,
        setLobbyID,
        sendMessage,
        messages,
        isConnected,
        shouldRefetchLobby,
        setShouldRefetchLobby,
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
