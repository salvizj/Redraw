import React from "react";

type CanvasEraserProps = {
  canvasBgColor: string;
  setLineColor: (lineColor: string) => void;
};

const CanvasEraser: React.FC<CanvasEraserProps> = ({
  canvasBgColor,
  setLineColor,
}) => {
  return (
    <div className="flex justify-center">
      <button
        onClick={() => setLineColor(canvasBgColor)}
        title="Use Eraser"
        className="bg-secondary-light dark:bg-secondary-dark text-text-light dark:text-text-dark font-bold text-lg p-2 rounded-full shadow hover:bg-secondary-dark dark:hover:bg-secondary-light transition duration-200"
      >
        🧽
      </button>
    </div>
  );
};

export default CanvasEraser;
