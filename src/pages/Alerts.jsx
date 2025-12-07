import { useEffect, useState } from "react";
import { API_BASE } from "../App";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  const load = async () => {
    const r = await fetch(`${API_BASE}/alerts`);
    setAlerts(await r.json());
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Low Stock Alerts</h2>

      {alerts.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded">
          All good! No low stock items.
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((g) => (
            <div key={g.id} className="bg-red-50 border border-red-200 p-4 rounded flex justify-between">
              <div>
                <div className="font-semibold text-red-700">{g.name}</div>
                <div className="text-sm text-red-600">
                  Stock: {g.stock} | Threshold: {g.threshold} | Unit Cost: ₹ {g.unit_cost}
                </div>
              </div>
              <div className="bg-red-200 text-red-700 px-3 py-1 rounded text-xs font-semibold">
                ⚠ Needs Refill
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
