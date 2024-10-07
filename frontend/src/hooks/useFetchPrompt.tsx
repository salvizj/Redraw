import { useState, useCallback } from "react";
import { getPrompt } from "../api/prompt/getPromptApi";
import { useLobbyContext } from "../context/lobbyContext";
import { useUserContext } from "../context/userContext";
import { useLanguage } from "../context/languageContext";
import { FetchPromptParams, Prompt } from "../types";

export const useFetchPrompt = () => {
  const { lobbyId } = useLobbyContext();
  const { sessionId, username } = useUserContext();
  const [getPromptLoading, setGetPromptLoading] = useState<boolean>(false);
  const [getPromptError, setGetPromptError] = useState<Error | null>(null);
  const { language } = useLanguage();

  const fetchPrompt = useCallback(
    async ({ setPrompt, setPromptId }: FetchPromptParams) => {
      setGetPromptLoading(true);
      setGetPromptError(null);

      if (!sessionId || !lobbyId || !username) {
        const missingFields: string[] = [];
        if (!sessionId) missingFields.push("sessionId");
        if (!lobbyId) missingFields.push("lobbyId");
        if (!username) missingFields.push("username");

        const errorMessage = new Error(
          language === "en"
            ? `Missing required context: ${missingFields.join(", ")}`
            : `Trūkst vajadzīgais context: ${missingFields.join(", ")}`,
        );
        setGetPromptError(errorMessage);
        setGetPromptLoading(false);
        return;
      }

      try {
        console.log("Calling getPrompt API with:", {
          sessionId,
          lobbyId,
        });

        const response = (await getPrompt({
          sessionId,
          lobbyId,
        })) as Prompt;

        if (response) {
          setPrompt(response);
          setPromptId(response.promptId);
        } else {
          throw new Error(
            language === "en" ? "Received null prompt" : "Saņēmām null props",
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err
            : new Error(
                language === "en"
                  ? "An unknown error occurred"
                  : "Notika nezināma kļūda",
              );
        setGetPromptError(errorMessage);
      } finally {
        setGetPromptLoading(false);
      }
    },
    [sessionId, lobbyId, username, language],
  );

  return { getPromptLoading, getPromptError, fetchPrompt };
};
