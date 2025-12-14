import React from "react";

export default function Blocked() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-red-50">
      <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Stay Focused!</h1>
        <p className="text-lg text-gray-700 mb-2">This site is blocked during your focus session.</p>
        <p className="text-sm text-gray-500">Take a deep breath and get back to work. 🚀</p>
      </div>
    </div>
  );
}
