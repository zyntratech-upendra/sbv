import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  User,
  Menu,
  X,
  LogOut,
  BookOpen,
  ClipboardList,
  BarChart3,
  UserPlus,
} from "lucide-react";

export default function TeacherSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/teacher/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/teacher/profile", icon: User, label: "My Profile" },
    { path: "/teacher/register-student", icon: UserPlus, label: "Register Student" },
    { path: "/teacher/classes", icon: BookOpen, label: "My Classes" },
    { path: "/teacher/attendance", icon: ClipboardList, label: "Attendance" },
    { path: "/teacher/reports", icon: BarChart3, label: "Reports" },
  ];

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-gradient-to-b from-green-600 to-green-800 text-white transition-all duration-300 h-screen flex flex-col shadow-lg`}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between">
        {isOpen && <h1 className="text-2xl font-bold">SBV</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-green-700 rounded-lg"
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
                  ? "bg-green-500 text-white"
                  : "text-green-100 hover:bg-green-700"
              }`}
            >
              <item.icon size={20} />
              {isOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-green-500">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-green-100 hover:bg-green-700 transition">
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
