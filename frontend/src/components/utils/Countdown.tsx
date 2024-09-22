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
  const [counter, setCounter] = useState<number>(() => {
    const storedCounter = localStorage.getItem("countdown");
    if (storedCounter !== null) {
      return parseInt(storedCounter);
    } else {
      localStorage.setItem("countdown", String(initialCounter));
      return initialCounter;
    }
  });

  const counterRef = useRef<number>(counter);
  const intervalRef = useRef<number | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const startCountdown = () => {
      intervalRef.current = window.setInterval(() => {
        counterRef.current -= 1;
        setCounter(counterRef.current);

        localStorage.setItem("countdown", String(counterRef.current));

        if (counterRef.current <= 0) {
          if (intervalRef.current !== null)
            window.clearInterval(intervalRef.current);
          localStorage.removeItem("countdown");
          onCountdownComplete();
        }
      }, 1000);
    };

    startCountdown();

    return () => {
      if (intervalRef.current !== null)
        window.clearInterval(intervalRef.current);
    };
  }, [onCountdownComplete]);

  return (
    <h2>
      {text} {counter}
      {language === "en" ? " seconds left" : " sekundas palikušas"}
    </h2>
  );
};
