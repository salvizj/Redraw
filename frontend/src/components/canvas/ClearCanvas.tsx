import React from "react";
import { useLanguage } from "../../context/languageContext";

type ClearCanvasProps = {
  clearCanvas: boolean;
  setClearCanvas: (clearCanvas: boolean) => void;
};

const ClearCanvas: React.FC<ClearCanvasProps> = ({ setClearCanvas }) => {
  const { language } = useLanguage();

  return (
    <div className="flex justify-center">
      <button
        onClick={() => setClearCanvas(true)}
        className="bg-primary-light dark:bg-primary-dark text-background-light dark:text-background-dark font-semibold py-2 px-4 rounded-lg shadow hover:bg-primary-dark dark:hover:bg-primary-light transition duration-200"
      >
        {language === "en" ? "Clear Canvas" : "Notīrīt Audeklu"}
      </button>
    </div>
  );
};

export default ClearCanvas;
