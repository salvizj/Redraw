import React, { useRef, useState, useEffect } from "react";

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (canvas && context) {
      canvas.width = 500;
      canvas.height = 500;
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (context) {
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (isDrawing && context) {
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.strokeStyle = "black";
      context.lineWidth = 2;
      context.stroke();
    }
  };

  const stopDrawing = () => {
    const context = canvasRef.current?.getContext("2d");

    if (context && isDrawing) {
      context.closePath();
      setIsDrawing(false);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      style={{ border: "1px solid black" }}
    />
  );
};

export default Canvas;
