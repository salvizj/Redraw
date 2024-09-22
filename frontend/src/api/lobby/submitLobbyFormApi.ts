import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createLobby = async (data: { username: string }) => {
  try {
    const response = await axios.post(`${BASE_URL}/create-lobby`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const joinLobby = async (data: {
  username: string;
  lobbyId: string;
}) => {
  try {
    const response = await axios.post(`${BASE_URL}/join-lobby`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
