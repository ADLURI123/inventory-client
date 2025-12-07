import React, { useEffect, useState } from "react";
import { API_BASE } from "../App";

export default function Foods() {
  const [foods, setFoods] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [name, setName] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [recipe, setRecipe] = useState([]);

  const loadFoods = async () => {
    const r = await fetch(`${API_BASE}/foods`);
    setFoods(await r.json());
  };

  const loadGroceries = async () => {
    const r = await fetch(`${API_BASE}/groceries`);
    setGroceries(await r.json());
  };

  useEffect(() => {
    loadFoods();
    loadGroceries();
  }, []);

  const toggleGroceryInRecipe = (g) => {
    const exists = recipe.find((r) => r.grocery_id === g.id);
    if (exists) {
      setRecipe(recipe.filter((r) => r.grocery_id !== g.id));
    } else {
      setRecipe([...recipe, { grocery_id: g.id, quantity: 0 }]);
    }
  };

  const updateQty = (id, qty) => {
    setRecipe(recipe.map((r) => (r.grocery_id === id ? { ...r, quantity: qty } : r)));
  };

  const openNew = () => {
    setEditing(null);
    setName("");
    setSellingPrice("");
    setRecipe([]);
    setModalOpen(true);
  };

  const openEdit = (food) => {
    setEditing(food.id);
    setName(food.name);
    setSellingPrice(food.selling_price);
    setRecipe(
      food.groceries.map((g) => ({
        grocery_id: g.grocery_id,
        quantity: g.quantity
      }))
    );
    setModalOpen(true);
  };

  const saveFood = async () => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API_BASE}/food/${editing}` : `${API_BASE}/food`;
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        selling_price: Number(sellingPrice),
        groceries: recipe
      })
    });
    setModalOpen(false);
    loadFoods();
  };

  const del = async (id) => {
    if (!confirm("Delete?")) return;
    await fetch(`${API_BASE}/food/${id}`, { method: "DELETE" });
    loadFoods();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Foods</h2>
        <button
          onClick={openNew}
          className="bg-slate-900 text-white px-4 py-2 rounded"
        >
          + Add Food
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Cost</th>
              <th className="p-2 text-left">Selling Pricd</th>
              <th className="p-2 text-left">Profit</th>
              <th className="p-2 text-left">Margin %</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((f) => (
              <tr key={f.id} className="border-b">
                <td className="p-2">{f.name}</td>
                <td className="p-2">₹ {f.cost_price.toFixed(2)}</td>
                <td className="p-2">₹ {f.selling_price.toFixed(2)}</td>
                <td className="p-2">₹ {(f.selling_price - f.cost_price).toFixed(2)}</td>
                <td className="p-2">{f.margin_percent.toFixed(1)}%</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => openEdit(f)}
                    className="px-3 py-1 bg-amber-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => del(f.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {foods.length === 0 && (
              <tr>
                <td className="p-4 text-center text-slate-500" colSpan="6">
                  No foods added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[600px] space-y-4">
            <h3 className="text-lg font-semibold">
              {editing ? "Edit Food" : "Add Food"}
            </h3>

            <div className="space-y-2">
              <input
                className="border p-2 rounded w-full"
                placeholder="Food name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="number"
                className="border p-2 rounded w-full"
                placeholder="Selling price"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
              />
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto border rounded p-2">
              {groceries.map((g) => {
                const sel = recipe.find((r) => r.grocery_id === g.id);
                return (
                  <div key={g.id} className="flex justify-between items-center">
                    <label>
                      <input
                        type="checkbox"
                        checked={!!sel}
                        onChange={() => toggleGroceryInRecipe(g)}
                        className="mr-2"
                      />
                      {g.name} (₹ {g.unit_cost}/unit)
                    </label>
                    {sel && (
                      <input
                        type="number"
                        className="border p-1 rounded w-24"
                        placeholder="Qty"
                        value={sel.quantity}
                        onChange={(e) => updateQty(g.id, Number(e.target.value))}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-slate-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveFood}
                className="px-4 py-2 bg-slate-900 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
