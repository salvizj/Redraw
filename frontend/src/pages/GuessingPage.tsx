import React, { useEffect, useState } from "react";
import { getCanvas } from "../api/canvas/getCanvasApi";
import { useLobbyContext } from "../context/lobbyContext";

const GuessingPage: React.FC = () => {
  const { lobbyId } = useLobbyContext();
  const [canvasData, setCanvasData] = useState<string | null>(null);

  useEffect(() => {
    const fetchCanvas = async () => {
      if (lobbyId) {
        try {
          const data = await getCanvas(lobbyId);
          setCanvasData(data.canvasData);
        } catch (error) {
          console.error("Failed to fetch canvas:", error);
        }
      }
    };

    fetchCanvas();
  }, [lobbyId]);

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen flex flex-col items-center justify-center ">
      {canvasData ? (
        <img src={`data:image/png;base64,${canvasData}`} alt="Canvas" />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GuessingPage;
