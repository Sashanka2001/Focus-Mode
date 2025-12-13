import React from "react";
import Header from "./components/Header";
import FocusSession from "./components/FocusSession";
import SiteList from "./components/SiteList";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <Header />
      <div className="mt-6 w-full max-w-md space-y-4">
        <FocusSession />
        <SiteList />
      </div>
    </div>
  );
}

export default App;
