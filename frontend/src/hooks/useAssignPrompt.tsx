import { useState, useCallback } from "react";
import { assignPrompt } from "../api/prompt/assignPrompt";

export const useAssignPrompt = () => {
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const executeAssignPrompt = useCallback(async (lobbyId: string) => {
    setError(null);
    try {
      const result = await assignPrompt({ lobbyId });
      setResponse(result.message);
    } catch (err) {
      setError("Failed to assign prompt");
    } finally {
    }
  }, []);

  return { executeAssignPrompt, error, response };
};
