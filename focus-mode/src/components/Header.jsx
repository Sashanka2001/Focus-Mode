import React from "react";

export default function Header() {
  return (
    <header className="w-full rounded-b-xl bg-brand text-white shadow-card">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-2 px-6 py-5 text-center">
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
          Stay in flow
        </span>
        <h1 className="text-3xl font-semibold">Focus Mode Productivity</h1>
        <p className="text-sm text-white/80">
          Launch focus sessions, block distractions, and track tab switches in one place.
        </p>
      </div>
    </header>
  );
}
