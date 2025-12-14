import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import FocusSession from "./components/FocusSession";
import AmbientSoundPanel from "./components/AmbientSoundPanel";
import SiteList from "./components/SiteList";

function App() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("focusmode-dark") === "true";
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("focusmode-dark", dark);
  }, [dark]);

  return (
    <div className={"flex min-h-screen flex-col items-center p-4 " + (dark ? "bg-gray-900" : "bg-gray-100") + " dark:bg-gray-900"}>
      <div className="w-full flex justify-end max-w-2xl">
        <button
          className="mt-4 mb-2 rounded px-3 py-1 text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          onClick={() => setDark((d) => !d)}
        >
          {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
      <Header />
      <div className="mt-6 w-full max-w-2xl space-y-4">
        <FocusSession />
        <AmbientSoundPanel />
        <SiteList />
      </div>
    </div>
  );
}

export default App;
