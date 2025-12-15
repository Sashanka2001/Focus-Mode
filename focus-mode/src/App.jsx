import React, { useState, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import Sidebar from "./components/Sidebar";
import FocusSessionPage from "./components/FocusSessionPage";
import AmbientSoundPage from "./components/AmbientSoundPage";
import BlockedSitesPage from "./components/BlockedSitesPage";
import ProductivityReportPage from "./components/ProductivityReportPage";
import AmbientPlayer from "./components/AmbientPlayer";
import LoginModal from './components/LoginModal';

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
    <div className={`flex min-h-screen ${dark ? "bg-gray-900" : "bg-gray-100"}`}>
      <Sidebar dark={dark} />
      <div className="flex-1 pl-64">
        <div className="p-4">
          <AmbientPlayer />
          <div className="flex justify-end items-center mb-4 gap-3">
            <LoginModal />
            <button
              onClick={() => setDark(!dark)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                dark
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-white text-gray-900 hover:bg-gray-50"
              } shadow-md`}
            >
              {dark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
          <Routes>
            <Route path="/" element={<FocusSessionPage />} />
            <Route path="/ambient-sound" element={<AmbientSoundPage />} />
            <Route path="/blocked-sites" element={<BlockedSitesPage />} />
            <Route path="/productivity-report" element={<ProductivityReportPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
