import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LobbyForm from "../components/LobbyForm";
import { createLobby, joinLobby } from "../api/submitLobbyFormApi";

type FormData = {
  username: string;
  lobbyId?: string;
};

function cookieExists(name: string): boolean {
  // Get all cookies as a string
  const cookies = document.cookie;

  console.log(cookies);

  // Check if the cookie name exists in the cookies string
  return cookies.split("; ").some((cookie) => cookie.startsWith(`${name}=`));
}

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
        await createLobby({ username: formData.username });
        if (cookieExists("sessionId")) {
          console.log("Cookie exists!");
        } else {
          console.log("Cookie does not exist.");
        }
      }
      navigate("/lobby");
    } catch (error) {
      setError("Error during submission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-blue-400">
        Welcome to the Lobby
      </h1>
      {loading ? (
        <p className="text-blue-300">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <LobbyForm onSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default IndexPage;
