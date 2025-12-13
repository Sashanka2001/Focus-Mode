import React from "react";
import Header from "./components/Header";
import FocusSession from "./components/FocusSession";
import SiteList from "./components/SiteList";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Header />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-6 px-4 py-10">
        <FocusSession />
        <SiteList />
      </main>
    </div>
  );
}

export default App;
