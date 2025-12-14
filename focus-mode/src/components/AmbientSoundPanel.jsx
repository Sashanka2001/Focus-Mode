import React, { useMemo, useState } from "react";

const YOUTUBE_TRACKS = [
  {
    id: "yt1",
    label: "Lofi Rainy Night",
    url: "https://www.youtube.com/embed/YRJ6xoiRcpQ?si=zLdmeC_qz9jEFcWe",
    description: "Lofi hip hop with rain ambience."
  },
  {
    id: "yt2",
    label: "Calm Piano & Rain",
    url: "https://www.youtube.com/embed/MWPYhebILb4?si=hZZPLmq-GTXO9ebR",
    description: "Relaxing piano and rain for focus."
  },
  {
    id: "yt3",
    label: "Nature Forest Stream",
    url: "https://www.youtube.com/embed/UIDcT_4DUek?si=pUGKIZrUZmkBOhIo",
    description: "Forest stream and birds for deep work."
  },
];


export default function AmbientSoundPanel() {
  const options = useMemo(() => YOUTUBE_TRACKS, []);
  const initialTrack = options.length ? options[0].id : null;
  const [selectedTrack, setSelectedTrack] = useState(initialTrack);

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Ambient Focus Sound</h2>
          <p className="text-sm text-slate-500">
            Layer gentle audio underneath your session to drown out background distractions.
          </p>
        </div>
        <span className="self-start rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide bg-slate-200 text-slate-600">
          YouTube
        </span>
      </header>

      <div className="flex flex-wrap gap-3">
        {options.map((track) => {
          const isActive = selectedTrack === track.id;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => setSelectedTrack(track.id)}
              aria-pressed={isActive}
              className={`group flex flex-1 min-w-[140px] cursor-pointer flex-col rounded-xl border px-4 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isActive
                  ? "border-brand bg-brand/10 text-brand-dark focus-visible:outline-brand"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand/60 hover:bg-brand/5 focus-visible:outline-slate-400"
              }`}
            >
              <span className="text-sm font-semibold">{track.label}</span>
              <span className="mt-1 text-xs text-slate-500 group-[aria-pressed='true']:text-brand-dark/80">
                {track.description}
              </span>
            </button>
          );
        })}
      </div>
      <div className="w-full flex justify-center mt-4">
        {selectedTrack && (
          <iframe
            width="100%"
            height="180"
            src={options.find((t) => t.id === selectedTrack).url}
            title="YouTube ambient sound"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-xl border w-full max-w-xl"
          ></iframe>
        )}
      </div>
    </section>
  );
}
