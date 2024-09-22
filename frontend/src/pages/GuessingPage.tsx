import React, { useEffect, useState } from "react";
import { getCanvas } from "../api/getCanvasApi";
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
    <div>
      {canvasData ? (
        <img src={`data:image/png;base64,${canvasData}`} alt="Canvas" />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GuessingPage;
