import { Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import LandingPage from "./components/landing/LandingPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<AppShell />} />
    </Routes>
  );
}
