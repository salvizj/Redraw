import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useWebSocketContext } from "../context/webSocketContext";
import { useUserContext } from "../context/userContext";
import { useLobbyContext } from "../context/lobbyContext";
import Canvas from "../components/Canvas";
import { Message, MessageType } from "../types";
import { Countdown } from "../components/utils/Countdown";
import { PromptInput } from "../components/PromtInput";

const GamePage: React.FC = () => {
  const { sendMessage, messages } = useWebSocketContext();
  const { sessionId, username } = useUserContext();
  const { lobbyId, players } = useLobbyContext();
  const [syncComplete, setSyncComplete] = useState(false);
  const [promptSent, setPromptSent] = useState(false);
  const [hasSentSyncMessage, setHasSentSyncMessage] = useState(false);
  const [drawingComplete, setDrawingComplete] = useState(false);

  useEffect(() => {
    if (sessionId && lobbyId && !hasSentSyncMessage) {
      const syncMessage: Message = {
        type: MessageType.SyncPlayers,
        sessionId: sessionId,
        lobbyId: lobbyId,
        data: `${username} has entered the game`,
      };
      sendMessage(syncMessage);
      setHasSentSyncMessage(true);
    }
  }, [sendMessage, sessionId, lobbyId, username, hasSentSyncMessage]);

  useEffect(() => {
    const syncPlayerMessages = messages.filter(
      (msg) => msg.type === MessageType.SyncPlayers,
    );

    const usernamesInMessages = syncPlayerMessages.map(
      (msg) => msg.data.split(" ")[0],
    );

    const syncedPlayers = usernamesInMessages.filter((msgUsername) =>
      players.some((player) => player.username === msgUsername),
    );

    if (syncedPlayers.length >= players.length) {
      setSyncComplete(true);
    }
  }, [messages, players, username]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-blue-400">Game Page</h1>

      {syncComplete ? (
        <>
          {promptSent ? (
            <>
              {drawingComplete ? (
                <Navigate to="/showcase" />
              ) : (
                <>
                  <Countdown
                    text={"Seconds left to draw"}
                    initialCounter={10}
                    onCountdownComplete={() => setDrawingComplete(true)}
                  />
                  <Canvas />
                </>
              )}
            </>
          ) : (
            <>
              <Countdown
                text={"Seconds left to enter the promt"}
                initialCounter={10}
                onCountdownComplete={() => setPromptSent(true)}
              />
              <PromptInput
                sessionId={sessionId}
                username={username}
                lobbyId={lobbyId}
                onPromptSent={() => setPromptSent(true)}
              />
            </>
          )}
        </>
      ) : (
        <p className="text-xl">Waiting for all players to sync...</p>
      )}
    </div>
  );
};

export default GamePage;
