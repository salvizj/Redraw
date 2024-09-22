import React from "react";

type ErrorProps = {
  message?: string | null;
};

const Error: React.FC<ErrorProps> = ({ message }) => {
  if (!message) return null;

  return <p className="text-red-500">Error: {message}</p>;
};

export default Error;
