
import React from "react";
import useScreenTime from "../hooks/useScreenTime";

export default function Header() {
  const screenTime = useScreenTime();
  const hours = Math.floor(screenTime / 3600);
  const minutes = Math.floor((screenTime % 3600) / 60);
  const seconds = screenTime % 60;
  return (
    <header className="w-full rounded-b-xl bg-brand text-white shadow-card dark:bg-slate-800 dark:text-slate-100">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-2 px-6 py-5 text-center">
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide dark:bg-slate-700/40 dark:text-slate-200">
          Stay in flow
        </span>
        <h1 className="text-3xl font-semibold">Focus Mode Productivity</h1>
          <button
            className="mt-4 mb-2 rounded-lg px-5 py-2 text-base font-bold border-2 border-white dark:border-slate-400 bg-white/80 dark:bg-slate-700 text-brand dark:text-slate-100 shadow-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition"
            onClick={() => setDark((d) => !d)}
          >
            {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
      </div>
    </header>
  );
}
