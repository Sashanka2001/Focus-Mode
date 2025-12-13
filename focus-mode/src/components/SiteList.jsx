import React, { useState } from "react";

export default function SiteList() {
  const [sites, setSites] = useState([]);
  const [newSite, setNewSite] = useState("");

  const addSite = () => {
    if (newSite.trim()) {
      setSites(prev => [...prev, newSite.trim()]);
      setNewSite("");
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Blocked Sites</h2>
          <p className="text-sm text-slate-500">Add URLs that should stay off-limits during focus sessions.</p>
        </div>
        <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
          {sites.length} saved
        </span>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={newSite}
          onChange={(event) => setNewSite(event.target.value)}
          placeholder="Enter site URL"
          className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
        <button
          onClick={addSite}
          className="inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2 text-sm text-slate-600">
        {sites.map((site, index) => (
          <li
            key={`${site}-${index}`}
            className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2"
          >
            <span className="truncate">{site}</span>
            <span className="text-xs font-medium uppercase text-slate-400">Blocked</span>
          </li>
        ))}
        {!sites.length && (
          <li className="rounded-xl border border-dashed border-slate-300 px-3 py-4 text-center text-slate-400">
            No sites yet—add your first distraction.
          </li>
        )}
      </ul>
    </div>
  );
}
