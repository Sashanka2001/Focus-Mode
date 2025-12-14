import { useEffect, useRef, useState } from "react";

export default function useScreenTime() {
  const [screenTime, setScreenTime] = useState(0); // seconds
  const intervalRef = useRef(null);
  const lastActiveRef = useRef(Date.now());

  useEffect(() => {
    function onActivity() {
      lastActiveRef.current = Date.now();
    }
    window.addEventListener("mousemove", onActivity);
    window.addEventListener("keydown", onActivity);
    window.addEventListener("mousedown", onActivity);
    window.addEventListener("touchstart", onActivity);

    intervalRef.current = setInterval(() => {
      // If user was active in last 60s, count as screen time
      if (Date.now() - lastActiveRef.current < 60000) {
        setScreenTime((t) => t + 1);
      }
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("mousemove", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("mousedown", onActivity);
      window.removeEventListener("touchstart", onActivity);
    };
  }, []);

  return screenTime;
}
