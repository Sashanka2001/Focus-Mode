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
    <div className="p-4 space-y-4 bg-white shadow rounded">
      <p className="text-gray-700">Session: {sessionActive ? "Active" : "Stopped"}</p>
      <div className="space-x-2">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={startSession}
        >
          Start Session
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={stopSession}
        >
          Stop Session
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={simulateTabSwitch}
        >
          Simulate Tab Switch
        </button>
      </div>
      <p className="text-gray-700">Tab switches detected: {switchCount}</p>
    </div>
  );
}
