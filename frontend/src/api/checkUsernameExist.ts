import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const checkUsernameExist = async (data: {
  username: string;
  lobbyId: string;
}) => {
  try {
    const response = await axios.post(`${BASE_URL}/check-username-exist`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
