import { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import DefineGrocery from "./pages/DefineGrocery";
import Stocks from "./pages/Stocks";
import Alerts from "./pages/Alerts";
import Foods from "./pages/Foods";

export const API_BASE = "https://inventory-service-f8csdnctf6bsgmcx.canadacentral-01.azurewebsites.net";

export default function App() {
  const [tab, setTab] = useState("dashboard");

  return (
    <>
      <Navbar tab={tab} setTab={setTab} />
      <div className="max-w-5xl mx-auto p-4">
        {tab === "dashboard" && <Dashboard />}
        {tab === "define" && <DefineGrocery />}
        {tab === "stocks" && <Stocks />}
        {tab === "alerts" && <Alerts />}
        {tab === "foods" && <Foods />}
      </div>
    </>
  );
}
