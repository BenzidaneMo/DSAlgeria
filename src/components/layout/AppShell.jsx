import ControlBar from "./ControlBar";
import MainWorkspace from "./MainWorkspace";
import Navbar from "./Navbar";

export default function AppShell() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-bg-app text-text-primary">
      <Navbar />
      <MainWorkspace />
      <ControlBar />
    </div>
  );
}
