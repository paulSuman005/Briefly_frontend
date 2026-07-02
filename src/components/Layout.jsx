import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  return (
    <div className="h-dvh w-full flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0">
        <Outlet /> 
      </div>
    </div>
  );
}