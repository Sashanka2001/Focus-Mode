import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function getInitialStats() {
  // Try to load from localStorage, else return empty
  const data = localStorage.getItem("focusmode-stats");
  if (data) return JSON.parse(data);
  return {};
}

function saveStats(stats) {
  localStorage.setItem("focusmode-stats", JSON.stringify(stats));
}

export default function ProductivityReport() {
  const [stats, setStats] = useState(getInitialStats());
  const [period, setPeriod] = useState("7d"); // "7d" or "30d"

  useEffect(() => {
    // Listen for updates from other tabs
    const onStorage = (e) => {
      if (e.key === "focusmode-stats") setStats(getInitialStats());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Prepare data for chart
  const now = new Date();
  const days = period === "7d" ? 7 : 30;
  const labels = Array.from({ length: days }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (days - 1 - i));
    return d.toLocaleDateString();
  });
  const focusData = labels.map((date) => stats[date]?.sessions || 0);
  const tabSwitchData = labels.map((date) => stats[date]?.tabSwitches || 0);
  const screenTimeData = labels.map((date) => Math.round((stats[date]?.screenTime || 0) / 60));

  const data = {
    labels,
    datasets: [
      {
        label: "Focus Sessions",
        data: focusData,
        backgroundColor: "#2563eb",
      },
      {
        label: "Tab Switches",
        data: tabSwitchData,
        backgroundColor: "#f59e42",
      },
      {
        label: "Screen Time (min)",
        data: screenTimeData,
        backgroundColor: "#16a34a",
      },
    ],
  };

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:bg-slate-800 dark:border-slate-700">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Productivity Report</h2>
        <div>
          <button
            className={`px-3 py-1 rounded-l border border-slate-300 dark:border-slate-600 text-xs font-semibold ${period === "7d" ? "bg-brand text-white" : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200"}`}
            onClick={() => setPeriod("7d")}
          >
            Last 7 days
          </button>
          <button
            className={`px-3 py-1 rounded-r border-t border-b border-r border-slate-300 dark:border-slate-600 text-xs font-semibold ${period === "30d" ? "bg-brand text-white" : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200"}`}
            onClick={() => setPeriod("30d")}
          >
            Last 30 days
          </button>
        </div>
      </header>
      <div className="text-left">
        <Bar data={data} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
      </div>
    </section>
  );
}
