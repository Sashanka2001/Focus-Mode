import React, { useMemo, useState } from "react";
import { AMBIENT_TRACKS, useAmbientSound } from "../hooks/useAmbientSound";

export default function AmbientSoundPanel() {
  const { isSupported, play, stop, setVolume, currentTrack, isPlaying, volume } = useAmbientSound(0.4);
  const options = useMemo(() => AMBIENT_TRACKS, []);
  const initialTrack = options.length ? options[0].id : null;
  const [selectedTrack, setSelectedTrack] = useState(initialTrack);

  const statusLabel = isPlaying ? "Playing" : "Idle";

  const handleSelectTrack = (trackId) => {
    setSelectedTrack(trackId);
    if (isPlaying && currentTrack !== trackId) {
      void play(trackId);
    }
  };

  const handleToggle = async () => {
    if (!selectedTrack) {
      return;
    }

    if (isPlaying && currentTrack === selectedTrack) {
      stop();
    } else {
      await play(selectedTrack);
    }
  };

  const handleVolumeChange = (event) => {
    setVolume(Number(event.target.value));
  };

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Ambient Focus Sound</h2>
          <p className="text-sm text-slate-500">
            Layer gentle audio underneath your session to drown out background distractions.
          </p>
        </div>
        <span
          className={`self-start rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            isPlaying ? "bg-brand/10 text-brand-dark" : "bg-slate-200 text-slate-600"
          }`}
        >
          {statusLabel}
        </span>
      </header>

      {!isSupported ? (
        <p className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">
          Web Audio API is not available in this browser. Try Chrome, Edge, or Safari to enable ambient sounds.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-3">
            {options.map((track) => {
              const isActive = selectedTrack === track.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelectTrack(track.id)}
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

          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggle}
                className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isPlaying && currentTrack === selectedTrack
                    ? "bg-danger hover:bg-danger-dark focus-visible:outline-danger"
                    : "bg-brand hover:bg-brand-dark focus-visible:outline-brand"
                }`}
              >
                {isPlaying && currentTrack === selectedTrack ? "Stop" : "Play"}
              </button>
              {isPlaying && currentTrack && currentTrack !== selectedTrack && (
                <span className="text-xs text-slate-500">
                  Currently playing {options.find((track) => track.id === currentTrack)?.label ?? "a track"}.
                </span>
              )}
            </div>

            <label className="flex flex-1 flex-col gap-1 text-xs font-medium text-slate-500">
              Volume
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 accent-brand"
                />
                <span className="w-12 text-right text-sm text-slate-600">{Math.round(volume * 100)}%</span>
              </div>
            </label>
          </div>
        </>
      )}
    </section>
  );
}
