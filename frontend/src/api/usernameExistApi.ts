import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const usernameExist = async (data: {
  username: string;
  lobbyId: string;
}) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/username-exist`,

      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error in API call:", error);
    throw error;
  }
};
