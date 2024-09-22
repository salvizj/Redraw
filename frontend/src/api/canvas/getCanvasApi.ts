import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getCanvas = async (lobbyId: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/get-canvas`, lobbyId);
    return response.data;
  } catch (error) {
    throw error;
  }
};
