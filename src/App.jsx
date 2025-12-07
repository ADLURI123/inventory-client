import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import DefineGrocery from "./pages/DefineGrocery";
import Stocks from "./pages/Stocks";
import Alerts from "./pages/Alerts";
import Foods from "./pages/Foods";

export const API_BASE = "https://inventory-service-f8csdnctf6bsgmcx.canadacentral-01.azurewebsites.net";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/define" element={<DefineGrocery />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/foods" element={<Foods />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}
