import React from "react";

export default function Notification({ message }) {
  return (
    <div className="relative rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
      {message}
    </div>
  );
}
