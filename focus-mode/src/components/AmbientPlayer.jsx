import React, { useEffect, useState } from 'react';
import ambientState from '../lib/ambientState';

export default function AmbientPlayer() {
  const [state, setState] = useState(ambientState.getState());

  useEffect(() => {
    const unsub = ambientState.subscribe(setState);
    return unsub;
  }, []);

  if (!state.playing || !state.url) return null;

  // Render an iframe that is kept mounted at the app root so navigation won't stop it
  return (
    <div aria-hidden className="fixed bottom-4 right-4 z-50 pointer-events-none">
      <div className="w-72 h-44 rounded-lg overflow-hidden shadow-lg pointer-events-auto">
        <iframe
          title="Ambient Player"
          src={state.url}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    </div>
  );
}
