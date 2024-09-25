import { useState, useCallback } from "react";
import { assignPrompt } from "../api/prompt/assignPrompt";

export const useAssignPrompt = () => {
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const executeAssignPrompt = useCallback(async (lobbyId: string) => {
    setError(null);
    setResponse(null);

    try {
      const result = await assignPrompt({ lobbyId });
      if (result.message) {
        setResponse(result.message);
      } else {
        setError("Unexpected response format");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign prompt");
    }
  }, []);

  return { executeAssignPrompt, error, response };
};
