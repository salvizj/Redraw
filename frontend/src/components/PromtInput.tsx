import React, { useState } from "react";
import { createPrompt } from "../api/createPromtApi";

export const PromptInput: React.FC<{
  sessionId: string | null;
  lobbyId: string | null;
  username: string | null;
  onPromptSent: () => void;
}> = ({ sessionId, lobbyId, username, onPromptSent }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (sessionId && lobbyId && username) {
      try {
        await createPrompt({
          prompt: inputValue,
          sessionId,
          lobbyId,
          username,
        });
        setInputValue("");
        onPromptSent();
      } catch (error) {
        setError("Failed to submit prompt. Please try again.");
      }
    } else {
      setError("Missing sessionId, lobbyId, or username.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter your prompt"
        className="text-black p-2 mb-4"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Submit
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}{" "}
    </div>
  );
};
