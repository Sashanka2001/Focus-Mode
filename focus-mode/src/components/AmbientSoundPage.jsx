import React from 'react';
import AmbientSoundPanel from './AmbientSoundPanel';

const AmbientSoundPage = () => {
  return (
    <div className="ml-6 p-6 flex justify-center">
      <div className="w-full max-w-5xl">
      <h2 className="text-2xl font-bold mb-4">Ambient Focus Sound</h2>
      <AmbientSoundPanel />
      </div>
    </div>
  );
};

export default AmbientSoundPage;