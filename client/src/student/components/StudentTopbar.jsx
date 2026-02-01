import { Bell, User, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentTopbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-8 py-4 flex items-center justify-between">
        <h2 className="text-gray-700 font-semibold">Welcome, {user.name || "Student"}</h2>

        <div className="flex items-center gap-6">
          <button className="text-gray-600 hover:text-gray-800 relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              1
            </span>
          </button>

          <button className="text-gray-600 hover:text-gray-800">
            <Settings size={20} />
          </button>

          <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {user.name?.[0] || "S"}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-50"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
