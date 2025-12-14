import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import FocusSession from "./components/FocusSession";
import AmbientSoundPanel from "./components/AmbientSoundPanel";

import ProductivityReport from "./components/ProductivityReport";

function App() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("focusmode-dark") === "true";
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("focusmode-dark", dark);
  }, [dark]);

  return (
    <div className={"flex min-h-screen flex-col items-center p-4 " + (dark ? "bg-gray-900" : "bg-gray-100") + " dark:bg-gray-900"}>
      <Header dark={dark} setDark={setDark} />
      <div className="mt-6 w-full max-w-2xl space-y-4">
        <FocusSession />
        <AmbientSoundPanel />
        <SiteList />
        <ProductivityReport />
      </div>
    </div>
  );
}

export default App;
