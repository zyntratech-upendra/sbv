import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Menu,
  X,
  LogOut,
  ClipboardList,
} from "lucide-react";

export default function StudentSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/student/attendance", icon: ClipboardList, label: "Attendance" },
    { path: "/student/profile", icon: User, label: "My Profile" },
  ];

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-gradient-to-b from-purple-600 to-purple-800 text-white transition-all duration-300 h-screen flex flex-col shadow-lg`}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between">
        {isOpen && <h1 className="text-2xl font-bold">SBV</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-purple-700 rounded-lg"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive(item.path)
                  ? "bg-purple-500 text-white"
                  : "text-purple-100 hover:bg-purple-700"
              }`}
            >
              <item.icon size={20} />
              {isOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-purple-500">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-purple-100 hover:bg-purple-700 transition">
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
