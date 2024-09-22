import React from "react";
import { Message } from "../types";

type WsMessagesProps = {
  messages: Message[];
};

const DisplayWsMessages: React.FC<WsMessagesProps> = ({ messages }) => {
  return (
    <div>
      <h2>Received Messages</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <p>
              <strong>Type:</strong> {msg.type}
            </p>
            <p>
              <strong>Session ID:</strong> {msg.sessionId}
            </p>
            <p>
              <strong>Lobby ID:</strong> {msg.lobbyId}
            </p>
            <p>
              <strong>Data:</strong> {msg.data}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayWsMessages;
