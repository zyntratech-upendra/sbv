import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  ClipboardList,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const StudentSidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
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
    { path: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/student/attendance", icon: ClipboardList, label: "Attendance" },
    { path: "/student/profile", icon: User, label: "My Profile" },
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
        className={`student-sidebar
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
        .student-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 240px;
          background: linear-gradient(180deg, #7a1f2b, #4a2c2a);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease, transform 0.3s ease;
          z-index: 1000;
          box-shadow: 4px 0 25px rgba(0,0,0,0.35);
        }

        .student-sidebar.collapsed {
          width: 72px;
        }

        /* Header */
        .sidebar-header {
          height: 64px;
          padding: 0 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.18);
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
          background: rgba(255,255,255,0.22);
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
          color: #f5eaea;
          text-decoration: none;
          font-size: 0.95rem;
          margin-bottom: 6px;
          transition: all 0.2s ease;
        }

        .menu-link:hover {
          background: rgba(255,255,255,0.18);
          color: #ffffff;
        }

        .menu-link.active {
          background: #f3d9d2;
          color: #5b1620;
          font-weight: 600;
        }

        .student-sidebar.collapsed .menu-link {
          justify-content: center;
        }

        /* Footer */
        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid rgba(255,255,255,0.18);
        }

        /* Logout */
        .logout {
          width: 100%;
          color: #ffe4e4;
          background: rgba(239, 68, 68, 0.22);
          border: 1px solid rgba(239, 68, 68, 0.45);
        }

        .logout:hover {
          background: #dc2626;
          color: #ffffff;
        }

        .student-sidebar.collapsed .logout {
          justify-content: center;
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .student-sidebar {
            transform: translateX(-100%);
            width: 240px;
          }

          .student-sidebar.mobile-open {
            transform: translateX(0);
          }

          .student-sidebar.collapsed {
            width: 240px;
          }
        }
      `}</style>
    </>
  );
};

export default StudentSidebar;
