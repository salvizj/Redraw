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

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setLineWidth(newValue);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.min(50, Math.max(1, Number(e.target.value)));
    setLineWidth(newValue);
  };

  return (
    <div>
      <label>
        {language === "en" ? "Line Width:" : "Līnijas Platums"}{" "}
        <span>{lineWidth}</span>
      </label>
      <input
        type="number"
        min="1"
        max="50"
        value={lineWidth}
        onChange={handleNumberChange}
      />
      <input
        type="range"
        min="1"
        max="50"
        value={lineWidth}
        step="5"
        onChange={handleSliderChange}
      />
    </div>
  );
};

export default CanvasLineWidthAdjuster;
