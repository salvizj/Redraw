import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createLobby, joinLobby } from "../../api/submitLobbyFormApi";
import { usernameExist } from "../../api/usernameExistApi";
import { useLanguage } from "../../context/languageContext";
const LobbyForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [lobbyId, setLobbyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const lobbyIdFromUrl = queryParams.get("l");
    if (lobbyIdFromUrl) {
      setLobbyId(lobbyIdFromUrl);
    }
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
      setError(
        language === "en"
          ? "Username is required"
          : "Lietotājvārds ir obligāts",
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (lobbyId) {
        const checkResponse = await usernameExist({
          username,
          lobbyId,
        });

        if (checkResponse.exists) {
          setError(
            language === "en"
              ? "Player with this username already exists in this lobby."
              : "Spēlētājs ar šo lietotājvārdu jau pastāv šajā vestibilā.",
          );
          setLoading(false);
          return;
        }

        await joinLobby({ username, lobbyId });
      } else {
        await createLobby({ username });
      }

      navigate("/lobby");
    } catch (error) {
      setError(
        language === "en"
          ? "Failed to join or create a lobby."
          : "Neizdevās pievienoties vai izveidot istabu.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-background-light dark:bg-background-dark p-8 rounded-xl max-w-md mx-auto ring-4 ring-primary-light dark:ring-primary-dark"
    >
      <div className="mb-6">
        <label className="block text-text-light dark:text-text-dark mb-2 text-xl font-bold">
          {language === "en" ? "Username:" : "Lietotājvārds:"}
          <input
            type="text"
            value={username}
            onChange={handleChange}
            className="bg-secondary-light dark:bg-secondary-dark text-text-light dark:text-text-dark border-2 border-primary-light dark:border-primary-dark rounded-xl p-3 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
          />
        </label>
      </div>
      {error && <p className="text-red-500 mb-4 font-semibold">{error}</p>}
      <button
        type="submit"
        className={`px-6 py-3 rounded-full font-bold text-lg transition-colors duration-300 ${
          loading || error
            ? "bg-secondary-light text-white cursor-not-allowed"
            : "bg-primary-light text-white hover:bg-primary-dark"
        }`}
        disabled={loading || !!error}
      >
        {loading
          ? language === "en"
            ? "Checking..."
            : "Pārbauda..."
          : lobbyId
            ? language === "en"
              ? "Join Lobby"
              : "Pievienoties Vestibilam"
            : language === "en"
              ? "Create Lobby"
              : "Izveidot Istabu"}
      </button>
    </form>
  );
};

export default LobbyForm;
