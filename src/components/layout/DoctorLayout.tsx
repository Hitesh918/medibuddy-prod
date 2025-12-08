import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DoctorSidebar from "../navigation/DoctorSidebar";
import { Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import { type RootState } from "../../store/store";

const DoctorLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { doctor } = useSelector((state: RootState) => state.doctorAuth);

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          {/* Sidebar */}
          <div className="relative h-full w-64 bg-white animate-in slide-in-from-left duration-300">
            <DoctorSidebar />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <DoctorSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Top Navbar for Mobile */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-700 hover:text-teal-600 transition"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 text-white h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm">
              {doctor?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-gray-800">
              Dr. {doctor?.name}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
