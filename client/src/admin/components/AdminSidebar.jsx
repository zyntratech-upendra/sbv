import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  Clock,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const AdminSidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
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
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/register-student", icon: Users, label: "Register Student" },
    {
      path: "/admin/register-teacher",
      icon: GraduationCap,
      label: "Register Teacher",
    },
    { path: "/admin/create-class", icon: BookOpen, label: "Create Class" },
    { path: "/admin/create-batch", icon: Layers, label: "Create Batch" },
    { path: "/admin/create-subject", icon: BookOpen, label: "Subjects" },
    {
      path: "/admin/teacher-allocation",
      icon: Users,
      label: "Teacher Allocation",
    },
    { path: "/admin/timetable", icon: Clock, label: "Timetable" },
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
        className={`admin-sidebar
          ${collapsed ? "collapsed" : ""}
          ${mobileOpen ? "mobile-open" : ""}`}
      >
        {/* HEADER */}
        <div className="sidebar-header">
          {!collapsed && <span className="logo">SBV</span>}

          {/* UNIVERSAL TOGGLE */}
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
        .admin-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 260px;
          background: linear-gradient(180deg, #535434, #6a6b48);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease, transform 0.3s ease;
          z-index: 1000;
          box-shadow: 4px 0 25px rgba(0,0,0,0.25);
        }

        .admin-sidebar.collapsed {
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

        /* Toggle Button (Permanent Visible) */
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
          color: #e6e6d1;
          text-decoration: none;
          font-size: 0.95rem;
          margin-bottom: 6px;
        }

        .menu-link:hover {
          background: rgba(255,255,255,0.18);
          color: #fff;
        }

        .menu-link.active {
          background: #d7d8b6;
          color: #535434;
          font-weight: 600;
        }

        .admin-sidebar.collapsed .menu-link {
          justify-content: center;
        }

        /* Footer */
        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid rgba(255,255,255,0.15);
        }

        /* Logout button – danger style */
.logout {
width: 100%;
  color: #ffd6d6;
  background: rgba(255, 80, 80, 0.15);
  border: 1px solid rgba(247, 33, 33, 0.35);
}

/* Hover effect */
.logout:hover {
  background: #e42323;
  color: #ffffff;
}

/* Icon spacing fix when collapsed */
.admin-sidebar.collapsed .logout {
  justify-content: center;
}


        /* MOBILE */
        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%);
            width: 260px;
          }

          .admin-sidebar.mobile-open {
            transform: translateX(0);
          }

          .admin-sidebar.collapsed {
            width: 260px;
          }
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;
