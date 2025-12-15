import { useEffect, useState } from "react";
import timer from "../lib/timer";

export function useFocusTimer({ defaultMinutes = 25, onComplete } = {}) {
  const [localState, setLocalState] = useState(() => {
    const s = timer.getTimerState();
    return {
      isActive: s.isActive,
      durationMinutes: s.durationMinutes ?? defaultMinutes,
      remainingSeconds: s.remainingSeconds ?? defaultMinutes * 60,
    };
  });

  useEffect(() => {
    // set completion callback in timer
    timer.setOnComplete(onComplete);
  }, [onComplete]);

  useEffect(() => {
    const unsub = timer.subscribeTimer((s) => {
      setLocalState({
        isActive: s.isActive,
        durationMinutes: s.durationMinutes,
        remainingSeconds: s.remainingSeconds,
      });
    });
    return unsub;
  }, []);

  const start = (minutes) => timer.startTimer(minutes);
  const stop = () => timer.stopTimer();
  const reset = (minutes) => timer.resetTimer(minutes);
  const setDurationMinutes = (m) => timer.resetTimer(m);

  const totalSeconds = localState.durationMinutes * 60;
  const progress = totalSeconds === 0 ? 0 : (totalSeconds - localState.remainingSeconds) / totalSeconds;

  return {
    isActive: localState.isActive,
    start,
    stop,
    reset,
    remainingSeconds: localState.remainingSeconds,
    totalSeconds,
    progress,
    durationMinutes: localState.durationMinutes,
    setDurationMinutes,
  };
}
