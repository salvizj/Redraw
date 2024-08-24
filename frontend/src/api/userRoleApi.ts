import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const GetUserRole = async (data: { sessionId: string }) => {
  try {
    const response = await axios.post(`${BASE_URL}/get-user-role`, data);
    return response.data;
  } catch (error) {
    console.error("Error getting user role:", error);
    throw error;
  }
};
