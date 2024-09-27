import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useWebSocketContext } from "../context/webSocketContext";
import { useUserContext } from "../context/userContext";
import { useLobbyContext } from "../context/lobbyContext";
import Canvas from "../components/canvas/Canvas";
import { Countdown } from "../components/utils/Countdown";
import CanvasPromptForm from "../components/canvas/CanvasPromptForm";
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
import useFetchPrompt from "../hooks/useFetchPrompt";
import useCheckSetPrompts from "../hooks/useCheckSetPrompts";

const GamePage = () => {
  const { sendMessage, messages } = useWebSocketContext();
  const { sessionId, username, role } = useUserContext();
  const { lobbyId, players } = useLobbyContext();
  const { language } = useLanguage();
  const { executeAssignPrompt, assignError, response } = useAssignPrompt();
  const { gameStateError, gameState, fetchGameState, fetchEditGameState } =
    useGameState();
  const { getPromptError, fetchPrompt } = useFetchPrompt();
  const { checkPrompts, checkPromptsError, executeCheckSetPrompts } =
    useCheckSetPrompts();

  //states
  const [currentGameState, setCurrentGameState] = useState(
    GameState.StatusWaitingForPlayers,
  );
  const [prompt, setPrompt] = useState<string | null>(null);
  const [submittedPrompt, setSubmittedPrompt] = useState(false);
  const [drawingComplete, setDrawingComplete] = useState(false);
  const [savingCanvasStatus, setSavingCanvasStatus] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);

  useEffect(() => {
    if (sessionId && lobbyId && username) {
      handleEnteredGameMessage(sessionId, lobbyId, username, sendMessage);
      fetchGameState();
      if (gameState) {
        setCurrentGameState(gameState);
      }
      if (currentGameState === GameState.StatusGettingPrompts) {
        fetchPrompt({ setPrompt });
        if (prompt != null) {
          handleGotPromptMessage(sessionId, lobbyId, username, sendMessage);
        }
      }
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
        executeCheckSetPrompts(lobbyId, players.length);
        if (checkPrompts) {
          executeAssignPrompt(lobbyId);
          setIsAssigned(true);
        } else {
          executeCheckSetPrompts(lobbyId, players.length);
        }
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

  const renderGameContent = () => {
    if (currentGameState === GameState.StatusWaitingForPlayers) {
      return (
        <p>
          {language === "en"
            ? "Waiting for all players to enter the game..."
            : "Gaidam, lai visi spēlētāji ienāk spēlē..."}
        </p>
      );
    } else if (currentGameState === GameState.StatusAllSubmittedPrompts) {
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
    } else if (currentGameState === GameState.StatusAssigningPrompts) {
      return (
        <p>
          {language === "en"
            ? "Assigning prompts to players..."
            : "Piešķir nosacījumus spēlētājiem..."}
        </p>
      );
    } else if (currentGameState === GameState.StatusGettingPrompts) {
      return (
        <p>
          {language === "en"
            ? "Getting your prompt..."
            : "Iegūst tavu nosacījumu..."}
        </p>
      );
    } else if (currentGameState === GameState.StatusAllGotPrompts) {
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
    } else if (currentGameState === GameState.StatusAllFinishedDrawing) {
      return <Navigate to="/guessing" />;
    } else {
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
      <ErrorMessage
        message={
          gameStateError || assignError || getPromptError || checkPromptsError
        }
      />
      {renderGameContent()}
    </div>
  );
};

export default GamePage;
