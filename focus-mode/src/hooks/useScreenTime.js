import { useEffect, useState } from "react";
import screentimer from "../lib/screentimer";

export default function useScreenTime() {
  const [state, setState] = useState(() => {
    const s = screentimer.getScreenTime();
    return { screenTime: s.screenTime || 0 };
  });

  useEffect(() => {
    const unsub = screentimer.subscribeScreenTime((s) => {
      setState({ screenTime: s.screenTime || 0 });
    });
    return unsub;
  }, []);

  return state.screenTime;
}
