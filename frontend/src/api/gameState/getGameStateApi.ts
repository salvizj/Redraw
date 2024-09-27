import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getGameState = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/get-game-state`, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};
