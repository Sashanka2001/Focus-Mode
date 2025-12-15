import { useCallback, useEffect, useRef, useState } from "react";

export function useFocusTimer({ defaultMinutes = 25, onComplete } = {}) {
  const [isActive, setIsActive] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState(defaultMinutes);
  const [remainingSeconds, setRemainingSeconds] = useState(defaultMinutes * 60);
  const intervalRef = useRef(null);
  const completeCallbackRef = useRef(onComplete);
  const STORAGE_KEY = "focusmode-timer";

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
      // persist active timer start
      try {
        const payload = {
          isActive: true,
          durationMinutes: nextMinutes,
          startTimestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {
        // ignore
      }
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
      // clear persisted timer
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
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
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch (e) {}
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

  // Initialize from localStorage so timer survives page navigation
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw);
      if (stored?.isActive && stored?.startTimestamp && stored?.durationMinutes) {
        const elapsed = Math.floor((Date.now() - stored.startTimestamp) / 1000);
        const total = stored.durationMinutes * 60;
        const remaining = Math.max(total - elapsed, 0);
        setDurationMinutes(stored.durationMinutes);
        setRemainingSeconds(remaining);
        if (remaining > 0) {
          setIsActive(true);
        } else {
          // session already completed
          setIsActive(false);
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch (e) {}
          if (typeof completeCallbackRef.current === "function") {
            completeCallbackRef.current();
          }
        }
      } else if (stored && stored.isActive === false && typeof stored.remainingSeconds === 'number') {
        setDurationMinutes(stored.durationMinutes ?? defaultMinutes);
        setRemainingSeconds(stored.remainingSeconds);
        setIsActive(false);
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  // Persist remaining seconds when stopped
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const stored = raw ? JSON.parse(raw) : {};
      if (isActive) {
        // keep startTimestamp as-is
        // nothing to change here
      } else {
        // save snapshot of remaining time
        const payload = {
          isActive: false,
          durationMinutes,
          remainingSeconds,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
    } catch (e) {}
  }, [isActive, durationMinutes, remainingSeconds]);

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
