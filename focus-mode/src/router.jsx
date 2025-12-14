import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Blocked from "./components/Blocked";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/blocked" element={<Blocked />} />
      </Routes>
    </BrowserRouter>
  );
}
