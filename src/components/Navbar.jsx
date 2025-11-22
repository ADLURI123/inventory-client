import { NavLink } from "react-router-dom";

export default function Navbar() {
  const cls = (active) =>
    `px-4 py-2 rounded-lg text-sm font-semibold ${
      active ? "bg-slate-700 text-white" : "bg-slate-800/60 text-white"
    }`;

  return (
    <nav className="bg-slate-900 text-white px-6 py-3 mb-6 shadow">
      <div className="flex gap-2">
        <NavLink to="/" className={({ isActive }) => cls(isActive)}>
          Dashboard
        </NavLink>
        <NavLink to="/define" className={({ isActive }) => cls(isActive)}>
          Define Groceries
        </NavLink>
        <NavLink to="/stocks" className={({ isActive }) => cls(isActive)}>
          Stocks
        </NavLink>
        <NavLink to="/alerts" className={({ isActive }) => cls(isActive)}>
          Alerts
        </NavLink>
      </div>
    </nav>
  );
}
