import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useWebSocketContext } from "../context/webSocketContext";
import { useUserContext } from "../context/userContext";
import { useLobbyContext } from "../context/lobbyContext";
import Canvas from "../components/canvas/Canvas";
import { MessageType, Prompt } from "../types";
import { Countdown } from "../components/utils/Countdown";
import CanvasPromptForm from "../components/canvas/CanvasPromptForm";
import { getPrompt } from "../api/prompt/getPrompt";
import {
  handleEnteredGameMessage,
  handleSubmittedPromptMessage,
  handleGotPromptMessage,
} from "../utils/messageHandler";
import { useLanguage } from "../context/languageContext";
import { useAssignPrompt } from "../hooks/useAssignPrompt";
import ErrorMessage from "../components/utils/ErrorMessage";

enum GameStage {
  WaitingForPlayers,
  AllPlayersJoined,
  TypingPrompts,
  AllSubmittedPrompts,
  AssigningPrompts,
  GettingPrompts,
  AllGotPrompts,
  Drawing,
  AllFinishedDrawing,
}

const GamePage: React.FC = () => {
  const { sendMessage, messages } = useWebSocketContext();
  const { sessionId, username, role } = useUserContext();
  const { lobbyId, players } = useLobbyContext();
  const { language } = useLanguage();
  const { executeAssignPrompt, error, response } = useAssignPrompt();
  const [gameStage, setGameStage] = useState<GameStage>(
    GameStage.WaitingForPlayers,
  );
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [drawingComplete, setDrawingComplete] = useState(false);
  const [savingCanvasStatus, setSavingCanvasStatus] = useState(false);

  useEffect(() => {
    if (sessionId && lobbyId && username) {
      handleEnteredGameMessage(sessionId, lobbyId, username, sendMessage);
    }
  }, [sendMessage, sessionId, lobbyId, username]);

  useEffect(() => {
    const syncEnteredGameMessages = messages.filter(
      (msg) => msg.type === MessageType.EnteredGame,
    );
    const syncSubmittedPromptMessages = messages.filter(
      (msg) => msg.type === MessageType.SubmitedPrompt,
    );
    const syncGotPromptMessages = messages.filter(
      (msg) => msg.type === MessageType.GotPrompt,
    );

    if (
      syncEnteredGameMessages.length >= players.length &&
      gameStage === GameStage.WaitingForPlayers
    ) {
      setGameStage(GameStage.AllPlayersJoined);
    }

    if (
      syncSubmittedPromptMessages.length >= players.length &&
      gameStage === GameStage.TypingPrompts
    ) {
      setGameStage(GameStage.AllSubmittedPrompts);

      if (role === "leader" && lobbyId) {
        setGameStage(GameStage.AssigningPrompts);
        executeAssignPrompt(lobbyId).then(() => {
          if (response === "Prompt assigned successfully") {
            setGameStage(GameStage.GettingPrompts);
          }
        });
      }
    }

    if (
      syncGotPromptMessages.length >= players.length &&
      gameStage === GameStage.GettingPrompts
    ) {
      setGameStage(GameStage.AllGotPrompts);
    }
  }, [
    messages,
    players,
    gameStage,
    role,
    lobbyId,
    executeAssignPrompt,
    response,
  ]);

  const handlePromptSubmit = () => {
    if (sessionId && lobbyId && username) {
      handleSubmittedPromptMessage(sessionId, lobbyId, username, sendMessage);
      setGameStage(GameStage.AllSubmittedPrompts);
    }
  };

  useEffect(() => {
    const fetchPrompt = async () => {
      if (
        gameStage === GameStage.GettingPrompts &&
        sessionId &&
        username &&
        lobbyId
      ) {
        try {
          const response: Prompt = await getPrompt({
            sessionId,
            lobbyId,
          });
          setPrompt(response);
          handleGotPromptMessage(sessionId, lobbyId, username, sendMessage);
        } catch (error) {
          console.error(
            language === "en"
              ? "Error getting prompt:"
              : "Kļūda iegūstot nosacījumu",
            error,
          );
        }
      }
    };
    fetchPrompt();
  }, [gameStage, sessionId, lobbyId, username, sendMessage, language]);

  const renderGameStage = () => {
    switch (gameStage) {
      case GameStage.WaitingForPlayers:
        return (
          <p>
            {language === "en"
              ? "Waiting for all players to enter the game..."
              : "Gaidam, lai visi spēlētāji ienāk spēlē..."}
          </p>
        );
      case GameStage.AllPlayersJoined:
        setGameStage(GameStage.TypingPrompts);
        return null;
      case GameStage.TypingPrompts:
        return sessionId && username && lobbyId ? (
          <>
            <CanvasPromptForm
              sessionId={sessionId}
              username={username}
              lobbyId={lobbyId}
              onPromptSent={handlePromptSubmit}
            />
            <Countdown
              text={
                language === "en"
                  ? "Seconds left to submit your prompt"
                  : "Sekundes, lai nosūtītu nosacījumu"
              }
              initialCounter={10}
              onCountdownComplete={handlePromptSubmit}
            />
          </>
        ) : (
          <p>{language === "en" ? "Loading..." : "Ielādē..."}</p>
        );
      case GameStage.AllSubmittedPrompts:
        return (
          <p>
            {language === "en"
              ? "All prompts submitted. Assigning prompts..."
              : "Visi nosacījumi iesniegti. Piešķir nosacījumus..."}
          </p>
        );
      case GameStage.AssigningPrompts:
        return (
          <p>
            {language === "en"
              ? "Assigning prompts to players..."
              : "Piešķir nosacījumus spēlētājiem..."}
          </p>
        );
      case GameStage.GettingPrompts:
        return (
          <p>
            {language === "en"
              ? "Getting your prompt..."
              : "Iegūst tavu nosacījumu..."}
          </p>
        );
      case GameStage.AllGotPrompts:
        setGameStage(GameStage.Drawing);
        return null;
      case GameStage.Drawing:
        return (
          <>
            <Countdown
              text={
                language === "en"
                  ? "Seconds left to draw"
                  : "Sekundes, lai zīmētu"
              }
              initialCounter={60}
              onCountdownComplete={() => setDrawingComplete(true)}
            />
            <Canvas
              setSavingCanvasStatus={setSavingCanvasStatus}
              drawingComplete={drawingComplete}
              prompt={prompt?.prompt || null}
              promptId={prompt?.promptId || null}
              lobbyId={lobbyId}
            />
          </>
        );
      case GameStage.AllFinishedDrawing:
        return <Navigate to="/guessing" />;
      default:
        return (
          <p>
            {language === "en" ? "Unknown game stage" : "Nezināms spēles posms"}
          </p>
        );
    }
  };

  useEffect(() => {
    if (drawingComplete && savingCanvasStatus && prompt) {
      setGameStage(GameStage.AllFinishedDrawing);
    }
  }, [drawingComplete, savingCanvasStatus, prompt]);

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen flex flex-col items-center justify-center">
      <ErrorMessage message={error} />
      {renderGameStage()}
    </div>
  );
};

export default GamePage;
