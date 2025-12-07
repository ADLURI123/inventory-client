import { useEffect, useState } from "react";
import { API_BASE } from "../App";

export default function Stock() {
  const [groceries, setGroceries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState("");

  const load = async () => {
    const r = await fetch(`${API_BASE}/groceries`);
    setGroceries(await r.json());
  };

  useEffect(() => { load(); }, []);

  const openWindow = (g) => {
    setSelected(g);
    setQty("");
  };

  const closeWindow = () => {
    setSelected(null);
    setQty("");
  };

  const changeStock = async (mode) => {
    if (!qty || Number(qty) <= 0) return alert("Enter valid quantity");

    const url =
      mode === "add"
        ? `${API_BASE}/grocery/${selected.id}/add`
        : `${API_BASE}/grocery/${selected.id}/subtract`;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qty: Number(qty) })
    });

    closeWindow();
    load();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Stock Management</h2>

      {/* Table */}
      <div className="bg-white p-4 rounded-xl shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2">Name</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Threshold</th>
              <th className="p-2">Unit Cost</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groceries.map((g) => (
              <tr key={g.id} className="border-b">
                <td className="p-2">{g.name}</td>
                <td className="p-2">{g.stock}</td>
                <td className="p-2">{g.threshold}</td>
                <td className="p-2">₹ {g.unit_cost?.toFixed?.(2) ?? g.unit_cost}</td>
                <td className="p-2">
                  <button
                    className="px-3 py-1 bg-slate-900 text-white rounded"
                    onClick={() => openWindow(g)}
                  >
                    Manage Stock
                  </button>
                </td>
              </tr>
            ))}
            {groceries.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-slate-500">
                  No groceries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Center Window Panel */}
      {selected && (
        <div className="fixed top-0 left-0 w-full h-full flex items-start justify-center mt-12 z-10 pointer-events-none">
          <div className="bg-white border border-slate-300 rounded-xl p-6 w-[420px] shadow-xl space-y-5 pointer-events-auto">
            <h3 className="text-lg font-semibold text-center">
              Manage Stock — {selected.name}
            </h3>

            <div className="text-sm space-y-1 bg-slate-50 p-3 rounded">
              <div><strong>Current stock:</strong> {selected.stock}</div>
              <div><strong>Unit cost:</strong> ₹ {selected.unit_cost}</div>
              <div><strong>Threshold:</strong> {selected.threshold}</div>
            </div>

            <input
              type="number"
              className="border p-2 rounded w-full"
              placeholder="Enter quantity"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                onClick={() => changeStock("add")}
                className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded"
              >
                + Add Stock
              </button>
              <button
                onClick={() => changeStock("subtract")}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded"
              >
                − Subtract
              </button>
            </div>

            <button
              onClick={closeWindow}
              className="w-full bg-slate-400 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
