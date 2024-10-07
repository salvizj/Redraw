import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../context/languageContext";

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
  const [counter, setCounter] = useState<number>(initialCounter);
  const intervalRef = useRef<number | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter <= 1) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          onCountdownComplete();
          return 0;
        }
        return prevCounter - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [onCountdownComplete]);

  return (
    <h2>
      {text} {counter}{" "}
      {language === "en" ? "seconds left" : "sekundas palikušas"}
    </h2>
  );
};
