import { useState, useCallback } from "react";
import { assignPrompt } from "../api/prompt/assignPromptApi";

export const useLobbyPromptAssignment = () => {
  const [assignPromptsError, setAssignPromptsError] = useState<string | null>(
    null,
  );
  const [assignPromptsResponseStatus, setAssignPromptsResponseStatus] =
    useState<boolean>(false);

  const assignPromptsToLobby = useCallback(async (lobbyId: string) => {
    setAssignPromptsError(null);
    try {
      const result = await assignPrompt({ lobbyId });
      if (result.status === "success") {
        setAssignPromptsResponseStatus(true);
      } else {
        setAssignPromptsError("Unexpected response format");
      }
    } catch (err) {
      setAssignPromptsError(
        err instanceof Error
          ? err.message
          : "Failed to assign prompts to lobby",
      );
    }
  }, []);

  return {
    assignPromptsToLobby,
    assignPromptsError,
    assignPromptsResponseStatus,
  };
};
