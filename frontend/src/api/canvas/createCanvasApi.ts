import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createCanvas = async (data: {
  dataUrl: string;
  promptId: string;
  lobbyId: string;
}) => {
  try {
    const response = await axios.post(`${BASE_URL}/create-canvas`, {
      data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
