import React, { useState, useEffect, useRef, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { useLobbyContext } from "../context/lobbyContext";
import { useGameStateContext } from "../context/gameStateContext";
import { useLanguage } from "../context/languageContext";
import { useLobbyPromptAssignment } from "../hooks/useLobbyPromptAssignment";
import { useFetchPrompt } from "../hooks/useFetchPrompt";
import { useWsMessageSender } from "../hooks/ws/useWsMessageSender";
import Canvas from "../components/canvas/Canvas";
import { Countdown } from "../components/utils/Countdown";
import CanvasPromptForm from "../components/canvas/CanvasPromptForm";
import ErrorMessage from "../components/utils/ErrorMessage";
import { GameState, Prompt } from "../types";

const GamePage: React.FC = () => {
  const { sessionId, username, role } = useUserContext();
  const { lobbyId, lobbySettings } = useLobbyContext();
  const { gameState } = useGameStateContext();
  const { language } = useLanguage();
  const {
    assignPromptsError,
    assignPromptsToLobby,
    assignPromptsResponseStatus,
  } = useLobbyPromptAssignment();

  const { getPromptError, fetchPrompt } = useFetchPrompt();
  const {
    handleSubmittedPromptMessage,
    handleFinishedDrawingMessage,
    handleAssignPromptsComplete,
    handleGotPromptMessage,
  } = useWsMessageSender(sessionId, lobbyId, username);
  const formRef = useRef<any>(null);
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [promptId, setPromptId] = useState<string | null>(null);
  const [submittedPrompt, setSubmittedPrompt] = useState(false);
  const [drawingComplete, setDrawingComplete] = useState(false);
  const [savingCanvasStatus, setSavingCanvasStatus] = useState<boolean>(false);
  const promptMessageSent = useRef(false);
  const assignCompleteMessageSent = useRef(false);

  useEffect(() => {
    if (gameState === GameState.StatusGettingPrompts) {
      fetchPrompt({ setPrompt, setPromptId });
      promptMessageSent.current = false;
      assignCompleteMessageSent.current = false;
    }

    if (prompt != null && !promptMessageSent.current) {
      handleGotPromptMessage();
      promptMessageSent.current = true;
    }

    if (
      gameState === GameState.StatusAssigningPrompts &&
      role === "leader" &&
      assignPromptsResponseStatus === false
    ) {
      assignPromptsToLobby(lobbyId);
    }

    if (
      assignPromptsResponseStatus &&
      gameState === GameState.StatusAssigningPrompts &&
      !assignCompleteMessageSent.current
    ) {
      handleAssignPromptsComplete();
      assignCompleteMessageSent.current = true;
    }
  }, [gameState, role, lobbyId, assignPromptsResponseStatus, prompt]);

  const handlePromptSubmit = () => {
    handleSubmittedPromptMessage();
    setSubmittedPrompt(true);
  };

  const handleDrawingComplete = () => {
    handleFinishedDrawingMessage();
    setDrawingComplete(true);
  };
  const handleCountdownComplete = useCallback(() => {
    formRef.current?.handleForceSubmit();
    handlePromptSubmit();
  }, [handlePromptSubmit]);

  const renderGameContent = () => {
    switch (gameState) {
      case GameState.StatusWaitingForPlayers:
        return (
          <p>
            {language === "en"
              ? "Waiting for all players to enter the game..."
              : "Gaidam, lai visi spēlētāji ienāk spēlē..."}
          </p>
        );

      case GameState.StatusTypingPrompts:
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
              initialCounter={lobbySettings?.promptInputTime ?? 30}
              onCountdownComplete={handleCountdownComplete}
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

      case GameState.StatusDrawing:
        return (
          <>
            {savingCanvasStatus ? (
              <>
                <p>
                  {language === "en"
                    ? "Wait for guessing stage"
                    : "Gaidi, kad sāksies minēšanas stadija"}
                </p>
              </>
            ) : (
              <>
                <Countdown
                  text={
                    language === "en"
                      ? "Seconds left to draw"
                      : "Sekundes, lai zīmētu"
                  }
                  initialCounter={lobbySettings?.drawingTime ?? 90}
                  onCountdownComplete={handleDrawingComplete}
                />
                <Canvas
                  setSavingCanvasStatus={setSavingCanvasStatus}
                  drawingComplete={drawingComplete}
                  prompt={prompt}
                  promptId={promptId}
                  lobbyId={lobbyId}
                />
              </>
            )}
          </>
        );

      case GameState.StatusGameFinished:
        return <Navigate to="/guessing" />;

      default:
        return (
          <p>
            {language === "en" ? "Unknown game state" : "Nezināms spēles posms"}
          </p>
        );
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen flex flex-col items-center justify-center">
      <ErrorMessage message={assignPromptsError || getPromptError} />
      {renderGameContent()}
    </div>
  );
};

export default GamePage;
