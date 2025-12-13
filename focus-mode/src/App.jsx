import React from "react";
import Header from "./components/Header";
import FocusSession from "./components/FocusSession";
import AmbientSoundPanel from "./components/AmbientSoundPanel";
import SiteList from "./components/SiteList";

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-4">
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
