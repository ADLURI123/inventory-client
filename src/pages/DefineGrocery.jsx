import { useEffect, useState } from "react";
import { API_BASE } from "../App";

export default function DefineGrocery() {
  const [groceries, setGroceries] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [name, setName] = useState("");
  const [threshold, setThreshold] = useState("");
  const [unitCost, setUnitCost] = useState("");

  const load = async () => {
    const r = await fetch(`${API_BASE}/groceries`);
    setGroceries(await r.json());
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setName("");
    setThreshold("");
    setUnitCost("");
    setModalOpen(true);
  };

  const openEdit = (g) => {
    setEditing(g.id);
    setName(g.name);
    setThreshold(g.threshold);
    setUnitCost(g.unit_cost);
    setModalOpen(true);
  };

  const save = async () => {
    const body = {
      name: name.trim(),
      threshold: Number(threshold),
      unit_cost: Number(unitCost)
    };

    if (editing) {
      await fetch(`${API_BASE}/grocery/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch(`${API_BASE}/grocery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, stock: 0 }),
      });
    }

    setModalOpen(false);
    load();
  };

  const del = async (g) => {
    if (!confirm("Delete?")) return;
    await fetch(`${API_BASE}/grocery/${g.id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Define Groceries</h2>
        <button onClick={openNew} className="bg-slate-900 text-white px-4 py-2 rounded">
          + Add Grocery
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Unit Cost</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Threshold</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groceries.map((g) => (
              <tr key={g.id} className="border-b">
                <td className="p-2">{g.name}</td>
                <td className="p-2">₹ {g.unit_cost?.toFixed?.(2) ?? g.unit_cost}</td>
                <td className="p-2">{g.stock}</td>
                <td className="p-2">{g.threshold}</td>
                <td className="p-2 space-x-3">
                  <button onClick={() => openEdit(g)} className="px-3 py-1 text-white rounded">
                    Edit
                  </button>
                  <button onClick={() => del(g)} className="px-3 py-1 text-white rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {groceries.length === 0 && (
              <tr>
                <td className="p-4 text-center text-slate-500" colSpan="5">
                  No groceries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[450px] space-y-4">
            <h3 className="text-lg font-semibold">
              {editing ? "Edit Grocery" : "Add Grocery"}
            </h3>

            <div className="space-y-2">
              <label className="text-xs text-slate-600">Name</label>
              <input
                className="border p-2 rounded w-full"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label className="text-xs text-slate-600">Threshold</label>
              <input
                type="number"
                className="border p-2 rounded w-full"
                placeholder="Threshold"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
              />
              <label className="text-xs text-slate-600">Unit Cost</label>
              <input
                type="number"
                className="border p-2 rounded w-full"
                placeholder="Unit Cost"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-slate-300 rounded">
                Cancel
              </button>
              <button onClick={save} className="px-4 py-2 bg-slate-900 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
