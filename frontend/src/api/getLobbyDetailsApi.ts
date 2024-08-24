import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchLobbyDetails = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getLobbyDetails`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lobby details:", error);
    throw error;
  }
};
