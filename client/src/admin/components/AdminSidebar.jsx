import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  Menu,
  X,
  LogOut,
  Clock,
} from "lucide-react";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/register-student", icon: Users, label: "Register Student" },
    { path: "/admin/register-teacher", icon: GraduationCap, label: "Register Teacher" },
    { path: "/admin/create-class", icon: BookOpen, label: "Create Class" },
    { path: "/admin/create-batch", icon: Layers, label: "Create Batch" },
    { path: "/admin/create-subject", icon: BookOpen, label: "Subjects" },
    { path: "/admin/teacher-allocation", icon: Users, label: "Teacher Allocation" },
    { path: "/admin/timetable", icon: Clock, label: "Timetable" },
  ];

  return (
    <>
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-blue-600 to-blue-800 text-white transition-all duration-300 h-screen flex flex-col shadow-lg`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between">
          {isOpen && <h1 className="text-2xl font-bold">SBV</h1>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-blue-700 rounded-lg"
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
                    ? "bg-blue-500 text-white"
                    : "text-blue-100 hover:bg-blue-700"
                }`}
              >
                <item.icon size={20} />
                {isOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-blue-500">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-700 transition">
            <LogOut size={20} />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}
