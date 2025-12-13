import React, { useState } from "react";

export default function FocusSession() {
  const [sessionActive, setSessionActive] = useState(false);
  const [switchCount, setSwitchCount] = useState(0);

  const startSession = () => {
    setSessionActive(true);
    setSwitchCount(0);
  };

  const stopSession = () => {
    setSessionActive(false);
  };

  // Fake tab switch detection (since we can't access Chrome API in React directly)
  const simulateTabSwitch = () => {
    if (sessionActive) {
      setSwitchCount(prev => prev + 1);
      if (switchCount + 1 > 5) {
        alert("Focus Alert! You are switching tabs too often!");
        setSwitchCount(0);
      }
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">
          Session status
        </p>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${sessionActive ? "bg-success/15 text-success" : "bg-slate-200 text-slate-600"}`}
        >
          {sessionActive ? "Active" : "Stopped"}
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-full bg-success px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-success-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success"
          onClick={startSession}
        >
          Start Session
        </button>
        <button
          className="rounded-full bg-danger px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-danger-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
          onClick={stopSession}
        >
          Stop Session
        </button>
        <button
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          onClick={simulateTabSwitch}
        >
          Simulate Tab Switch
        </button>
      </div>
      <p className="text-sm text-slate-600">
        Tab switches detected: <span className="font-semibold text-brand-light">{switchCount}</span>
      </p>
    </div>
  );
}
