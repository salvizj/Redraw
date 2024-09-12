import React from "react";

export type StartButtonProps = {
  role: string | null;
  handleStart: () => void;
};

const StartButton: React.FC<StartButtonProps> = ({ role, handleStart }) => {
  const isLeader = role === "leader";

  return (
    <button
      onClick={handleStart}
      disabled={!isLeader}
      className={`py-2 px-4 rounded-lg shadow-md transition ${
        isLeader
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "bg-gray-500 text-gray-300 cursor-not-allowed"
      }`}
    >
      {isLeader ? "Start" : "Waiting for leader"}
    </button>
  );
};

export default StartButton;
