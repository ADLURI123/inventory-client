import { useEffect, useState } from "react";
import { API_BASE } from "../App";

export default function DefineGrocery() {
  const [name, setName] = useState("");
  const [threshold, setThreshold] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [groceries, setGroceries] = useState([]);

  const load = async () => {
    const r = await fetch(`${API_BASE}/groceries`);
    setGroceries(await r.json());
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    await fetch(`${API_BASE}/grocery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        threshold: Number(threshold),
        stock: 0,
        unit_cost: Number(unitCost)
      }),
    });
    setName("");
    setThreshold("");
    setUnitCost("");
    load();
  };

  const edit = async (g) => {
    const th = prompt("New threshold", g.threshold);
    const uc = prompt("New unit cost", g.unit_cost);
    await fetch(`${API_BASE}/grocery/${g.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        threshold: Number(th),
        unit_cost: Number(uc)
      }),
    });
    load();
  };

  const del = async (g) => {
    if (!confirm("Delete?")) return;
    await fetch(`${API_BASE}/grocery/${g.id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Define Groceries</h2>

      <div className="bg-white p-4 rounded-xl shadow flex gap-3">
        <input className="border p-2 rounded w-40" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border p-2 rounded w-40" type="number" placeholder="Threshold" value={threshold} onChange={(e) => setThreshold(e.target.value)} />
        <input className="border p-2 rounded w-40" type="number" placeholder="Unit Cost" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} />
        <button onClick={create} className="bg-slate-900 text-white px-4 rounded">Add</button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Threshold</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Unit Cost</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groceries.map((g) => (
              <tr key={g.id} className="border-b">
                <td className="p-2">{g.name}</td>
                <td className="p-2">{g.threshold}</td>
                <td className="p-2">{g.stock}</td>
                <td className="p-2">₹ {g.unit_cost?.toFixed?.(2) ?? g.unit_cost}</td>
                <td className="p-2 space-x-3">
                  <button onClick={() => edit(g)} className="px-3 py-1 bg-amber-500 text-white rounded">Edit</button>
                  <button onClick={() => del(g)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                </td>
              </tr>
            ))}
            {groceries.length === 0 && (
              <tr>
                <td className="p-4 text-center text-slate-500" colSpan="5">No groceries yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
