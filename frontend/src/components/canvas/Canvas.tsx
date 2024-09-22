import React, { useRef, useState, useEffect } from "react";
import CanvasColorPicker from "./CanvasColorPicker";
import ClearCanvas from "./ClearCanvas";
import CanvasLineWidthAdjuster from "./CanvasLineWidthAdjuster";
import CanvasEraser from "./CanvasEraser";
import CanvasGivenPrompt from "./CanvasGivenPrompt";
import { createCanvas } from "../../api/createCanvasApi";

type CanvasProps = {
  lobbyId: string | null;
  prompt: string | null;
  setSavingCanvasStatus: (savingCanvasStatus: boolean) => void;
  drawingComplete: boolean;
};

const Canvas: React.FC<CanvasProps> = ({
  lobbyId,
  prompt,
  setSavingCanvasStatus,
  drawingComplete,
}) => {
  const [lineColor, setLineColor] = useState<string>("black");
  const [lineWidth, setLineWidth] = useState<number>(2);
  const [clearCanvas, setClearCanvas] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const bgColor = "white";

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (canvas && context) {
      canvas.width = 800;
      canvas.height = 800;
      context.fillStyle = bgColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [clearCanvas]);

  useEffect(() => {
    if (clearCanvas) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (context && canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = bgColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      setClearCanvas(false);
    }
  }, [clearCanvas]);

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
    const context = canvasRef.current?.getContext("2d");

    if (isDrawing && context) {
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.strokeStyle = lineColor;
      context.lineWidth = lineWidth;
      context.stroke();
    }
  };

  const getCanvasDataUrl = () => {
    const canvas = canvasRef.current;
    return canvas?.toDataURL("image/png") || "";
  };

  const saveCanvas = async () => {
    setSavingCanvasStatus(true);
    const dataUrl = getCanvasDataUrl();
    if (prompt && lobbyId) {
      try {
        await createCanvas(dataUrl, prompt, lobbyId);
        console.log("Canvas saved successfully");
      } catch (error) {
        console.error("Error saving canvas:", error);
      } finally {
        setSavingCanvasStatus(false);
      }
    }
  };

  useEffect(() => {
    if (drawingComplete) {
      saveCanvas();
    }
  }, [drawingComplete]);

  const stopDrawing = () => {
    const context = canvasRef.current?.getContext("2d");

    if (context && isDrawing) {
      context.closePath();
      setIsDrawing(false);
    }
  };

  return (
    <div>
      <div>
        <CanvasGivenPrompt prompt={prompt} />
        <CanvasColorPicker lineColor={lineColor} setLineColor={setLineColor} />
        <CanvasLineWidthAdjuster
          lineWidth={lineWidth}
          setLineWidth={setLineWidth}
        />
        <ClearCanvas
          clearCanvas={clearCanvas}
          setClearCanvas={setClearCanvas}
        />
        <CanvasEraser setLineColor={setLineColor} canvasBgColor={bgColor} />
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="canvas"
      />
    </div>
  );
};

export default Canvas;
