import React from "react";
import { useLanguage } from "../../context/languageContext";
type CanvasColorPickerProps = {
  lineColor: string;
  setLineColor: (color: string) => void;
};

const CanvasColorPicker: React.FC<CanvasColorPickerProps> = ({
  lineColor,
  setLineColor,
}) => {
  const colors = ["green", "red", "blue", "yellow", "purple", "black"];
  const { language } = useLanguage();
  return (
    <div>
      <p>
        {language === "en" ? "Selected Color:" : "Izvēlētā Krāsa"}{" "}
        <span>{lineColor}</span>
      </p>
      <div>
        {colors.map((clr) => (
          <button
            key={clr}
            style={{ backgroundColor: clr }}
            onClick={() => setLineColor(clr)}
          />
        ))}
      </div>
    </div>
  );
};

export default CanvasColorPicker;
