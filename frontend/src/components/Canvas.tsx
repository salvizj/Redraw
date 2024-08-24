import React, { useEffect, useRef } from "react";

type CanvasProps = {
  canvasState: any;
  updateCanvasState: (state: any) => void;
};

const Canvas: React.FC<CanvasProps> = ({ canvasState, updateCanvasState }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
      }
    }
  }, [canvasState]);

  return <canvas ref={canvasRef} width={800} height={600} />;
};

export default Canvas;
