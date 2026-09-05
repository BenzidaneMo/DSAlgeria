import { useState } from "react";
import AppShell from "./components/layout/AppShell";
import LandingPage from "./components/landing/LandingPage";

export default function App() {
  const [showVisualizer, setShowVisualizer] = useState(false);

  return showVisualizer
    ? <AppShell />
    : <LandingPage onStart={() => setShowVisualizer(true)} />;
}
