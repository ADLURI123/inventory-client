import { useEffect, useState } from "react";
import { API_BASE } from "../App";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);

  const load = async () => {
    const r = await fetch(`${API_BASE}/stats/summary`);
    setSummary(await r.json());
  };

  useEffect(() => { load(); }, []);

  if (!summary) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dashboard Overview</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Total Items" value={summary.total_items} />
        <Card title="Low Items" value={summary.low_items} color="red" />
        <Card title="In Stock" value={summary.in_stock} color="green" />
      </div>

      <div className="bg-white p-4 rounded-xl shadow h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={summary.items}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="stock" />
            <Bar dataKey="threshold" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  const colorMap = {
    red: "text-red-600",
    green: "text-emerald-600",
    default: "text-slate-800",
  };
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="text-sm text-slate-500">{title}</div>
      <div className={`text-3xl font-semibold ${colorMap[color] || colorMap.default}`}>
        {value}
      </div>
    </div>
  );
}
