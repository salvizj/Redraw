import React from "react";

type CanvasGivenPromptProps = {
  prompt: string | null;
};

const CanvasGivenPrompt: React.FC<CanvasGivenPromptProps> = ({ prompt }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark p-4 rounded-md shadow-lg transition-shadow hover:shadow-xl">
      <p className="text-text-light dark:text-text-dark font-sans text-lg">
        {prompt}
      </p>
    </div>
  );
};

export default CanvasGivenPrompt;
