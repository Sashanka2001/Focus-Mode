
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
        <p className="text-sm text-white/80 dark:text-slate-200/80">
          Launch focus sessions, block distractions, and track tab switches in one place.
        </p>
        <span className="mt-2 inline-block rounded bg-white/10 px-3 py-1 text-xs font-mono dark:bg-slate-700/40">
          Screen time: {hours > 0 ? `${hours}h ` : ""}{minutes > 0 ? `${minutes}m ` : ""}{seconds}s
        </span>
      </div>
    </header>
  );
}
