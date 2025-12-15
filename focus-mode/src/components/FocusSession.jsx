import React, { useMemo, useState, useEffect } from "react";
import Notification from "./Notification";
import { useFocusTimer } from "../hooks/useFocusTimer";
import stats from "../lib/stats";
import screentimer from "../lib/screentimer";

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remaining = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${remaining}`;
}

export default function FocusSession() {
  const [notification, setNotification] = useState(null);
  const [switchCount, setSwitchCount] = useState(0);
  const [tabSwitchLimit, setTabSwitchLimit] = useState(5);
  // track session start screen time and start timestamp
  const startScreenRef = React.useRef(0);
  const startTsRef = React.useRef(null);
  const handleComplete = () => {
    setNotification("Focus block complete! Take a quick stretch.");
    // compute stats and save
    try {
      const endScreen = screentimer.getScreenTime().screenTime || 0;
      const screenDuring = Math.max(0, endScreen - (startScreenRef.current || 0));
      const sessionSeconds = (durationMinutes || 0) * 60;
      const dateKey = new Date().toLocaleDateString();
      stats.addSession({ dateKey, sessionSeconds, tabSwitches: switchCount, screenTimeSeconds: screenDuring });
    } catch (e) {}
  };

  const {
    isActive: sessionActive,
    start,
    stop,
    reset,
    remainingSeconds,
    totalSeconds,
    progress,
    durationMinutes,
    setDurationMinutes,
  } = useFocusTimer({ defaultMinutes: 25, onComplete: handleComplete });

  useEffect(() => {
    if (!notification) {
      return undefined;
    }

    const timeout = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timeout);
  }, [notification]);

  const startSession = () => {
    setSwitchCount(0);
    // snapshot screen time at start
    startScreenRef.current = screentimer.getScreenTime().screenTime || 0;
    startTsRef.current = Date.now();
    start(durationMinutes);
    setNotification(null);
  };

  const stopSession = () => {
    // record partial session as a stopped snapshot (optional)
    try {
      const elapsed = startTsRef.current ? Math.floor((Date.now() - startTsRef.current) / 1000) : 0;
      const screenNow = screentimer.getScreenTime().screenTime || 0;
      const screenDuring = Math.max(0, screenNow - (startScreenRef.current || 0));
      const dateKey = new Date().toLocaleDateString();
      // record partial session as a session entry (counts toward report)
      if (elapsed > 0) {
        stats.addSession({ dateKey, sessionSeconds: elapsed, tabSwitches: switchCount, screenTimeSeconds: screenDuring });
      }
    } catch (e) {}
    stop();
    setNotification("Session paused. Resume when you are ready.");
  };

  const handleDurationChange = (event) => {
    const minutes = Number(event.target.value);
    setDurationMinutes(minutes);
    if (!sessionActive) {
      reset(minutes);
    }
  };

  const handleTabLimitChange = (event) => {
    setTabSwitchLimit(Number(event.target.value));
  };

  const simulateTabSwitch = () => {
    if (!sessionActive) {
      setNotification("Start a session to track tab switches.");
      return;
    }

    setSwitchCount((prev) => {
      const next = prev + 1;
      if (next >= tabSwitchLimit) {
        setNotification("Focus alert: you reached your tab switch limit.");
      }
      // also persist increment for today's date
      try {
        const dateKey = new Date().toLocaleDateString();
        stats.incrementTabSwitch(dateKey, 1);
      } catch (e) {}
      return next;
    });
  };

  const switchesRemaining = useMemo(
    () => Math.max(tabSwitchLimit - switchCount, 0),
    [tabSwitchLimit, switchCount],
  );

  const progressPercent = Math.round(progress * 100);
  const formattedTime = formatTime(remainingSeconds);

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Focus Session</h2>
          <p className="text-sm text-slate-500">Define a session length, stay in flow, and monitor distraction habits.</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            sessionActive ? "bg-success/15 text-success" : "bg-slate-200 text-slate-600"
          }`}
        >
          {sessionActive ? "Active" : "Stopped"}
        </span>
      </header>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-1 flex-col justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Time Remaining</span>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-4xl font-semibold text-slate-900">{formattedTime}</p>
              <span className="text-sm font-medium text-brand-dark">{progressPercent}%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-brand transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-500">
              Session length
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={durationMinutes}
                  onChange={handleDurationChange}
                  className="flex-1 accent-brand"
                />
                <span className="w-12 text-right text-sm text-slate-700">{durationMinutes}m</span>
              </div>
            </label>

            <label className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-500">
              Tab switch limit
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="3"
                  max="12"
                  step="1"
                  value={tabSwitchLimit}
                  onChange={handleTabLimitChange}
                  className="flex-1 accent-brand"
                />
                <span className="w-12 text-right text-sm text-slate-700">{tabSwitchLimit}</span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:w-60">
          <p className="text-sm font-semibold text-slate-700">Session controls</p>
          <div className="flex flex-col gap-3">
            <button
              className="rounded-full bg-success px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-success-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success"
              onClick={startSession}
            >
              {sessionActive ? "Restart" : "Start"}
            </button>
            <button
              className="rounded-full bg-danger px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-danger-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
              onClick={stopSession}
            >
              Stop
            </button>
            <button
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              onClick={simulateTabSwitch}
            >
              Simulate Tab Switch
            </button>
          </div>
          <dl className="mt-2 space-y-2 text-xs text-slate-500">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <dt className="font-medium text-slate-600">Switches</dt>
              <dd className="text-sm font-semibold text-brand-dark">{switchCount}</dd>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <dt className="font-medium text-slate-600">Remaining</dt>
              <dd className={`text-sm font-semibold ${switchesRemaining === 0 ? "text-danger" : "text-success"}`}>
                {switchesRemaining}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {notification && <Notification message={notification} />}
    </div>
  );
}
