import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  UserPlus,
  BookOpen,
  ClipboardList,
  BarChart3,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const TeacherSidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;

  const handleToggle = () => {
    if (isMobile) {
      mobileOpen ? onMobileClose() : onToggle();
    } else {
      onToggle();
    }
  };

  const menuItems = [
    { path: "/teacher/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/teacher/profile", icon: User, label: "My Profile" },
    { path: "/teacher/register-student", icon: UserPlus, label: "Register Student" },
    { path: "/teacher/classes", icon: BookOpen, label: "My Classes" },
    { path: "/teacher/attendance", icon: ClipboardList, label: "Attendance" },
    { path: "/teacher/reports", icon: BarChart3, label: "Reports" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={onMobileClose} />
      )}

      {/* SIDEBAR */}
      <aside
        className={`teacher-sidebar
          ${collapsed ? "collapsed" : ""}
          ${mobileOpen ? "mobile-open" : ""}`}
      >
        {/* HEADER */}
        <div className="sidebar-header">
          {!collapsed && <span className="logo">SBV</span>}

          <button
            className="toggle-btn"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {mobileOpen || !collapsed ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* MENU */}
        <nav className="sidebar-menu">
          {menuItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={isMobile ? onMobileClose : undefined}
              className={({ isActive }) =>
                `menu-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="sidebar-footer">
          <button className="menu-link logout" onClick={handleLogout}>
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* STYLES */}
      <style>{`
        * {
          font-family: 'Inter', sans-serif;
        }

        /* Overlay */
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 999;
        }

        /* Sidebar */
        .teacher-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 260px;
          background: linear-gradient(180deg, #0f766e, #115e59);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease, transform 0.3s ease;
          z-index: 1000;
          box-shadow: 4px 0 25px rgba(0,0,0,0.25);
        }

        .teacher-sidebar.collapsed {
          width: 80px;
        }

        /* Header */
        .sidebar-header {
          height: 64px;
          padding: 0 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.15);
        }

        .logo {
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: 1px;
        }

        /* Toggle Button */
        .toggle-btn {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(255,255,255,0.25);
          border: none;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        /* Menu */
        .sidebar-menu {
          flex: 1;
          padding: 1rem 0.75rem;
          overflow-y: auto;
        }

        .menu-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0.7rem 0.95rem;
          border-radius: 12px;
          color: #ccfbf1;
          text-decoration: none;
          font-size: 0.95rem;
          margin-bottom: 6px;
        }

        .menu-link:hover {
          background: rgba(255,255,255,0.18);
          color: #ffffff;
        }

        .menu-link.active {
          background: #99f6e4;
          color: #064e3b;
          font-weight: 600;
        }

        .teacher-sidebar.collapsed .menu-link {
          justify-content: center;
        }

        /* Footer */
        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid rgba(255,255,255,0.15);
        }

        /* Logout */
        .logout {
          width: 100%;
          color: #ffe4e6;
          background: rgba(244,63,94,0.15);
          border: 1px solid rgba(244,63,94,0.4);
        }

        .logout:hover {
          background: #e11d48;
          color: #ffffff;
        }

        .teacher-sidebar.collapsed .logout {
          justify-content: center;
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .teacher-sidebar {
            transform: translateX(-100%);
            width: 260px;
          }

          .teacher-sidebar.mobile-open {
            transform: translateX(0);
          }

          .teacher-sidebar.collapsed {
            width: 260px;
          }
        }
      `}</style>
    </>
  );
};

export default TeacherSidebar;
