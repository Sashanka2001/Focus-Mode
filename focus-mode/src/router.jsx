import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Blocked from "./components/Blocked";
import { useState, useEffect } from "react";

export default function Router() {
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App dark={dark} setDark={setDark} />} />
        <Route path="/blocked" element={<Blocked dark={dark} setDark={setDark} />} />
      </Routes>
    </BrowserRouter>
  );
}
