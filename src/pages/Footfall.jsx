import { useEffect, useState } from "react";
import { API_BASE } from "../App";

export default function Footfall() {
  const [loading, setLoading] = useState(true);
  const [footfall, setFootfall] = useState(null);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(
          `${API_BASE}/predict/prophet?date=${today}`
        );
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Failed");
        setFootfall(data.predicted_footfall);
      } catch (e) {
        setError("Unable to fetch footfall");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [today]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Today’s Footfall Prediction</h2>

      <div className="bg-white rounded-xl shadow p-8 text-center">
        {loading && <div className="text-slate-500">Loading prediction...</div>}

        {!loading && error && (
          <div className="text-red-600">{error}</div>
        )}

        {!loading && footfall !== null && (
          <>
            <div className="text-slate-500 text-sm">Date</div>
            <div className="text-lg font-medium mb-4">{today}</div>

            <div className="text-slate-500 text-sm">
              Predicted Footfall
            </div>
            <div className="text-5xl font-bold text-emerald-600 mt-2">
              {footfall}
            </div>
          </>
        )}
      </div>
    </div>
  );
}