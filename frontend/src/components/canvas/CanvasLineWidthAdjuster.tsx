import React from "react";
import { useLanguage } from "../../context/languageContext";
type CanvasLineWidthAdjusterProps = {
  lineWidth: number;
  setLineWidth: (lineWidth: number) => void;
};

const CanvasLineWidthAdjuster: React.FC<CanvasLineWidthAdjusterProps> = ({
  lineWidth,
  setLineWidth,
}) => {
  const { language } = useLanguage();
  return (
    <div>
      <label>
        {language === "en" ? "Line Width:" : "Līnijas Platums"}{" "}
        <span>{lineWidth}</span>
      </label>
      <input
        type="range"
        min="1"
        max="50"
        value={lineWidth}
        onChange={(e) => setLineWidth(Number(e.target.value))}
      />
    </div>
  );
};

export default CanvasLineWidthAdjuster;
