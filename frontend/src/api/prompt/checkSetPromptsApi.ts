import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const checkSetPrompts = async (data: {
  lobbyId: string;
  playerCount: number;
}) => {
  try {
    const response = await axios.post(`${BASE_URL}/check-set-prompts`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
