import React, { useEffect, useState } from "react";

type CountdownProps = {
  text: string;
  initialCounter: number;
  onCountdownComplete: () => void;
};

export const Countdown: React.FC<CountdownProps> = ({
  text,
  initialCounter,
  onCountdownComplete,
}) => {
  const [counter, setCounter] = useState(initialCounter);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter <= 1) {
          clearInterval(countdownInterval);
          onCountdownComplete();
          return 0;
        }
        return prevCounter - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [onCountdownComplete]);

  return (
    <h2 className="text-2xl mb-4">
      {text} {counter} seconds left
    </h2>
  );
};
