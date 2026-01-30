import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  X
} from "lucide-react";

const AdminSidebar = ({ open, onClose }) => {
  return (
    <>
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <h4>SBV Admin</h4>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/admin" end onClick={onClose}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/admin/students" onClick={onClose}>
            <Users size={18} /> Students
          </NavLink>
          <NavLink to="/admin/teachers" onClick={onClose}>
            <GraduationCap size={18} /> Teachers
          </NavLink>
          <NavLink to="/admin/attendance" onClick={onClose}>
            <BookOpen size={18} /> Attendance
          </NavLink>
        </nav>
      </aside>

      {open && <div className="overlay" onClick={onClose}></div>}

      <style>{`
        .admin-sidebar {
          width: 240px;
          background: #535434;
          color: #d7d8b6;
          padding: 1rem;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          z-index: 2000;
        }

        .admin-sidebar.open {
          transform: translateX(0);
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .sidebar-header h4 {
          color: #fff;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          color: #fff;
          display: none;
        }

        /* NAV DOES NOT SCROLL */
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .admin-sidebar a {
          display: flex;
          gap: 10px;
          padding: 0.6rem 1rem;
          border-radius: 10px;
          color: #d7d8b6;
          text-decoration: none;
        }

        .admin-sidebar a.active,
        .admin-sidebar a:hover {
          background: rgba(255,255,255,0.15);
          color: #fff;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 1500;
        }

        /* DESKTOP */
        @media (min-width: 992px) {
          .admin-sidebar {
            transform: translateX(0);
            position: relative;
          }

          .overlay {
            display: none;
          }
        }

        /* MOBILE */
        @media (max-width: 991px) {
          .close-btn {
            display: block;
          }
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;
