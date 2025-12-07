import { useEffect, useState } from "react";
import { API_BASE } from "../App";

export default function Stocks() {
  const [data, setData] = useState([]);

  const load = async () => {
    const r = await fetch(`${API_BASE}/groceries`);
    setData(await r.json());
  };

  useEffect(() => { load(); }, []);

  const adjust = async (g, type) => {
    const qty = Number(prompt("Quantity"));
    if (!qty) return;
    await fetch(`${API_BASE}/grocery/${g.id}/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qty }),
    });
    load();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Stock Management</h2>

      <div className="bg-white p-4 rounded-xl shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Cost</th>
              <th className="p-2 text-left">Threshold</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((g) => (
              <tr key={g.id} className="border-b">
                <td className="p-2">{g.name}</td>
                <td className="p-2">{g.stock}</td>
                <td className="p-2">₹ {g.unit_cost}</td>
                <td className="p-2">{g.threshold}</td>
                <td className="p-2">
                  {g.stock < g.threshold ? (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Low</span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs">OK</span>
                  )}
                </td>
                <td className="p-2 space-x-2">
                  <button onClick={() => adjust(g, "add")} className="px-3 py-1 bg-emerald-600 text-white rounded">+ Add</button>
                  <button onClick={() => adjust(g, "subtract")} className="px-3 py-1 bg-amber-500 text-white rounded">- Remove</button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td className="p-4 text-center text-slate-500" colSpan="5">
                  No groceries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
