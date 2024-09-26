import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useWebSocketContext } from "../context/webSocketContext";
import { useUserContext } from "../context/userContext";
import { useLobbyContext } from "../context/lobbyContext";
import Canvas from "../components/canvas/Canvas";
import { Countdown } from "../components/utils/Countdown";
import CanvasPromptForm from "../components/canvas/CanvasPromptForm";
import { getPrompt } from "../api/prompt/getPrompt";
import {
  handleEnteredGameMessage,
  handleSubmittedPromptMessage,
  handleGotPromptMessage,
  handleAssignPromptsComplete,
} from "../utils/messageHandler";
import { useLanguage } from "../context/languageContext";
import { useAssignPrompt } from "../hooks/useAssignPrompt";
import ErrorMessage from "../components/utils/ErrorMessage";
import { useGameState } from "../hooks/useGameState";
import { GameState } from "../types";

const GamePage = () => {
  const { sendMessage, messages } = useWebSocketContext();
  const { sessionId, username, role } = useUserContext();
  const { lobbyId, players } = useLobbyContext();
  const { language } = useLanguage();
  const { executeAssignPrompt, assignError, response } = useAssignPrompt();
  const { gameStateError, gameState, fetchGameState, fetchEditGameState } =
    useGameState();

  const [currentGameState, setCurrentGameState] = useState("waitingForPlayers");
  const [prompt, setPrompt] = useState<string | null>(null);
  const [submittedPrompt, setSubmittedPrompt] = useState(false);
  const [drawingComplete, setDrawingComplete] = useState(false);
  const [savingCanvasStatus, setSavingCanvasStatus] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);

  useEffect(() => {
    if (sessionId && lobbyId && username) {
      handleEnteredGameMessage(sessionId, lobbyId, username, sendMessage);
      fetchGameState();
    }
  }, []);

  useEffect(() => {
    if (gameState) {
      setCurrentGameState(gameState);
    }
  }, [gameState]);

  useEffect(() => {
    if (role === "leader") {
      const enteredGameCount = messages.filter(
        (msg) => msg.type === "enteredGame",
      ).length;
      const submittedPromptCount = messages.filter(
        (msg) => msg.type === "submittedPrompt",
      ).length;
      const gotPromptCount = messages.filter(
        (msg) => msg.type === "gotPrompt",
      ).length;

      if (
        currentGameState === GameState.StatusWaitingForPlayers &&
        enteredGameCount === players.length
      ) {
        fetchEditGameState(GameState.StatusAllPlayersJoined);
      } else if (
        currentGameState === GameState.StatusAllPlayersJoined &&
        submittedPromptCount === players.length
      ) {
        fetchEditGameState(GameState.StatusAllSubmittedPrompts);
      } else if (
        currentGameState === GameState.StatusAllSubmittedPrompts &&
        !isAssigned &&
        lobbyId
      ) {
        fetchEditGameState(GameState.StatusAssigningPrompts);
        setTimeout(() => {
          executeAssignPrompt(lobbyId);
          setIsAssigned(true);
        }, 2000);
      } else if (
        currentGameState === GameState.StatusAssigningPrompts &&
        response === "Prompt assigned successfully" &&
        isAssigned &&
        sessionId &&
        lobbyId
      ) {
        handleAssignPromptsComplete(sessionId, lobbyId, sendMessage);
        fetchEditGameState(GameState.StatusGettingPrompts);
      } else if (
        currentGameState === GameState.StatusGettingPrompts &&
        gotPromptCount === players.length
      ) {
        fetchEditGameState(GameState.StatusAllGotPrompts);
      }
    }
  }, [
    messages,
    currentGameState,
    response,
    role,
    players.length,
    lobbyId,
    sessionId,
    isAssigned,
  ]);

  const handlePromptSubmit = () => {
    if (sessionId && lobbyId && username) {
      handleSubmittedPromptMessage(sessionId, lobbyId, username, sendMessage);
      setSubmittedPrompt(true);
    }
  };

  useEffect(() => {
    const fetchPrompt = async () => {
      if (
        currentGameState === GameState.StatusGettingPrompts &&
        sessionId &&
        username &&
        lobbyId
      ) {
        try {
          const response = await getPrompt({ sessionId, lobbyId });
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
  }, [currentGameState, sessionId, username, lobbyId]);

  const renderGameContent = () => {
    switch (currentGameState) {
      case GameState.StatusWaitingForPlayers:
        return (
          <p>
            {language === "en"
              ? "Waiting for all players to enter the game..."
              : "Gaidam, lai visi spēlētāji ienāk spēlē..."}
          </p>
        );
      case GameState.StatusAllSubmittedPrompts:
        return sessionId && username && lobbyId && !submittedPrompt ? (
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
              initialCounter={20}
              onCountdownComplete={handlePromptSubmit}
            />
          </>
        ) : (
          <p>
            {language === "en"
              ? "Waiting for others to submit prompts"
              : "Gaidam, kad citi iesniegs nosacījumus"}
          </p>
        );
      case GameState.StatusAssigningPrompts:
        return (
          <p>
            {language === "en"
              ? "Assigning prompts to players..."
              : "Piešķir nosacījumus spēlētājiem..."}
          </p>
        );
      case GameState.StatusGettingPrompts:
        return (
          <p>
            {language === "en"
              ? "Getting your prompt..."
              : "Iegūst tavu nosacījumu..."}
          </p>
        );
      case GameState.StatusAllGotPrompts:
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
              prompt={prompt}
              promptId={prompt}
              lobbyId={lobbyId}
            />
          </>
        );
      case GameState.StatusAllFinishedDrawing:
        return <Navigate to="/guessing" />;
      default:
        return (
          <p>
            {language === "en" ? "Unknown game state" : "Nezināms spēles posms"}
          </p>
        );
    }
  };

  useEffect(() => {
    if (drawingComplete && savingCanvasStatus && prompt) {
      fetchEditGameState("allDrawingsComplete");
    }
  }, [drawingComplete, savingCanvasStatus, prompt]);

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen flex flex-col items-center justify-center">
      <ErrorMessage message={gameStateError || assignError} />
      {renderGameContent()}
    </div>
  );
};

export default GamePage;
