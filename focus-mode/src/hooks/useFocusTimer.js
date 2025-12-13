import { useCallback, useEffect, useRef, useState } from "react";

export function useFocusTimer({ defaultMinutes = 25, onComplete } = {}) {
  const [isActive, setIsActive] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState(defaultMinutes);
  const [remainingSeconds, setRemainingSeconds] = useState(defaultMinutes * 60);
  const intervalRef = useRef(null);
  const completeCallbackRef = useRef(onComplete);

  useEffect(() => {
    completeCallbackRef.current = onComplete;
  }, [onComplete]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    clearTimer();
    setIsActive(false);
  }, [clearTimer]);

  const start = useCallback(
    (minutes) => {
      const nextMinutes = minutes ?? durationMinutes;
      clearTimer();
      setDurationMinutes(nextMinutes);
      setRemainingSeconds(nextMinutes * 60);
      setIsActive(true);
    },
    [clearTimer, durationMinutes],
  );

  const reset = useCallback(
    (minutes) => {
      const nextMinutes = minutes ?? durationMinutes;
      clearTimer();
      setDurationMinutes(nextMinutes);
      setRemainingSeconds(nextMinutes * 60);
      setIsActive(false);
    },
    [clearTimer, durationMinutes],
  );

  useEffect(() => {
    if (!isActive) {
      clearTimer();
      return undefined;
    }

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsActive(false);
          if (typeof completeCallbackRef.current === "function") {
            completeCallbackRef.current();
          }
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimer();
    };
  }, [isActive, clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const totalSeconds = durationMinutes * 60;
  const progress = totalSeconds === 0 ? 0 : (totalSeconds - remainingSeconds) / totalSeconds;

  return {
    isActive,
    start,
    stop,
    reset,
    remainingSeconds,
    totalSeconds,
    progress,
    durationMinutes,
    setDurationMinutes,
  };
}
