import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const assignPrompt = async (data: { lobbyId: string }) => {
  try {
    const response = await axios.post(`${BASE_URL}/assign-prompt`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
