import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const editGameState = async (data: { lobbyId: string }) => {
  try {
    const response = await axios.post(`${BASE_URL}/edit-game-state`, {
      data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
