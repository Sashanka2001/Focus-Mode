import React from 'react';
import FocusSession from './FocusSession';

const FocusSessionPage = () => {
  return (
    <div className="ml-6 p-6 flex justify-center"> 
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-4">Focus Session</h2>
        <FocusSession />
      </div>
    </div>
  );
};

export default FocusSessionPage;