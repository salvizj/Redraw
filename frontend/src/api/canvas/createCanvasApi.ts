import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createCanvas = async (
  dataUrl: string,
  prompt: string,
  lobbyId: string,
) => {
  try {
    const response = await axios.post(`${BASE_URL}/create-canvas`, {
      canvasData: dataUrl,
      prompt: prompt,
      lobbyId: lobbyId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
