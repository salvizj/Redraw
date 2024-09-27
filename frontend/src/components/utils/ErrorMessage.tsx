import React from "react";

type ErrorMessageProps = {
  message?: Error | string | null;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  const displayMessage = message instanceof Error ? message.message : message;

  return <div className="text-red-500">Error: {displayMessage}</div>;
};

export default ErrorMessage;
