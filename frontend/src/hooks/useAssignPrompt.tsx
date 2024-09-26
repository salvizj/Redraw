import { useState, useCallback } from "react";
import { assignPrompt } from "../api/prompt/assignPrompt";

export const useAssignPrompt = () => {
  const [assignError, setAssignError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const executeAssignPrompt = useCallback(async (lobbyId: string) => {
    setAssignError(null);
    setResponse(null);

    try {
      const result = await assignPrompt({ lobbyId });
      if (result.message) {
        setResponse(result.message);
      } else {
        setAssignError("Unexpected response format");
      }
    } catch (err) {
      setAssignError(
        err instanceof Error ? err.message : "Failed to assign prompt",
      );
    }
  }, []);

  return { executeAssignPrompt, assignError, response };
};
