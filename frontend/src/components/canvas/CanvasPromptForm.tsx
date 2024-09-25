import React, { useState } from "react";
import { createPrompt } from "../../api/prompt/createPromptApi";
import { useLanguage } from "../../context/languageContext";

const CanvasPromptForm: React.FC<{
  sessionId: string;
  lobbyId: string;
  username: string;
  onPromptSent: () => void;
}> = ({ sessionId, lobbyId, username, onPromptSent }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sessionId || !lobbyId || !username) {
      setError(
        language === "en"
          ? "Missing sessionId, lobbyId, or username."
          : "Trūksts sessijasId, istabasId, vai lietotājvārds",
      );
      return;
    }

    setLoading(true);
    setError(null);

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
      const errorMessage =
        language === "en"
          ? "Failed to submit prompt. Please try again."
          : "Nezidevāš iesniegt nosacīcumu. Lūdzu mēģiniet atkārtoti.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <form
        onSubmit={handleSubmit}
        className="bg-background-light dark:bg-background-dark p-8 rounded-xl max-w-md mx-auto ring-4 ring-primary-light dark:ring-primary-dark"
      >
        <label className="block text-text-light dark:text-text-dark mb-2 text-xl font-bold">
          {language === "en" ? "Prompt:" : "Nosacījums:"}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={
              language === "en"
                ? "Enter your prompt"
                : "Ievadiet savu nosacījumu"
            }
            disabled={loading}
            className="bg-secondary-light dark:bg-secondary-dark text-text-light dark:text-text-dark border-2 border-primary-light dark:border-primary-dark rounded-xl p-3 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
          />
        </label>
        <button
          type="submit"
          disabled={loading || !!error}
          className={`px-6 py-3 rounded-full font-bold text-lg transition-colors duration-300 ${
            loading || error
              ? "bg-secondary-light text-white cursor-not-allowed"
              : "bg-primary-light text-white hover:bg-primary-dark"
          }`}
        >
          {loading
            ? "Submitting..."
            : language === "en"
              ? "Submit"
              : "Iesniegt"}
        </button>
        {error && <p className="text-red-500 mb-4 font-semibold">{error}</p>}
      </form>
    </div>
  );
};

export default CanvasPromptForm;
