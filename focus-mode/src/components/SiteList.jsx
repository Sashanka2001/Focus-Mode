 import React, { useState } from "react";

export default function SiteList() {
  const [sites, setSites] = useState([]);
  const [newSite, setNewSite] = useState("");

  const addSite = () => {
    if (newSite) {
      setSites([...sites, newSite]);
      setNewSite("");
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded space-y-2">
      <h2 className="font-bold text-lg">Blocked Sites</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          value={newSite}
          onChange={(e) => setNewSite(e.target.value)}
          placeholder="Enter site URL"
          className="border p-1 rounded flex-1"
        />
        <button onClick={addSite} className="bg-blue-500 text-white px-2 rounded hover:bg-blue-600">
          Add
        </button>
      </div>
      <ul className="list-disc list-inside">
        {sites.map((site, idx) => (
          <li key={idx}>{site}</li>
        ))}
      </ul>
    </div>
  );
}
