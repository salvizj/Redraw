import { useState, useCallback } from "react";
import { checkSetPrompts } from "../api/prompt/checkSetPromptsApi";

const useCheckSetPrompts = () => {
  const [checkPrompts, setCheckPrompts] = useState<boolean>(false);
  const [checkPromptsError, setCheckPromptsError] = useState<Error | null>(
    null,
  );
  const executeCheckSetPrompts = useCallback(
    async (lobbyId: string, playerCount: number) => {
      setCheckPromptsError(null);

      try {
        const data = await checkSetPrompts({ lobbyId, playerCount });

        if (data?.status === "success") {
          setCheckPrompts(true);
        } else {
          setCheckPrompts(false);
        }
      } catch (error) {
        setCheckPromptsError(
          error instanceof Error ? error : new Error("Unknown error occurred"),
        );
        setCheckPrompts(false);
      }
    },
    [],
  );

  return {
    executeCheckSetPrompts,
    checkPrompts,
    checkPromptsError,
  };
};

export default useCheckSetPrompts;
