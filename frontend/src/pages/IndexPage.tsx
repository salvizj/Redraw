import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LobbyForm from "../components/LobbyForm";
import { createLobby, joinLobby } from "../api/submitLobbyFormApi";
import { FormData } from "../types";

const IndexPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    try {
      if (formData.lobbyId) {
        await joinLobby({
          username: formData.username,
          lobbyId: formData.lobbyId,
        });
      } else {
        await createLobby({
          username: formData.username,
        });
      }

      navigate("/lobby");
    } catch (error) {
      setError("Error during submission");
      console.error("Error during submission:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Index Page</h1>
      <LobbyForm onSubmit={handleSubmit} />
    </div>
  );
};
export default IndexPage;
