import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

type LobbyFormProps = {
  onSubmit: (formData: { username: string; lobbyId?: string }) => void;
};

const LobbyForm: React.FC<LobbyFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [lobbyId, setLobbyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const lobbyIdFromUrl = queryParams.get("l");
    if (lobbyIdFromUrl) {
      setLobbyId(lobbyIdFromUrl);
    }
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username) {
      onSubmit({ username, lobbyId: lobbyId || undefined });
    } else {
      setError("Username is required");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">{lobbyId ? "Join Lobby" : "Create Lobby"}</button>
    </form>
  );
};

export default LobbyForm;
