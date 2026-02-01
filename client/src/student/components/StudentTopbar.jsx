import { Bell, LogOut, Settings, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentTopbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* ================= TOPBAR ================= */}
      <header className="student-topbar">
        <div className="topbar-inner">

          {/* LEFT */}
          <div className="topbar-left">
            {/* Mobile menu */}
            <button
              className="icon-btn d-md-none"
              onClick={onMenuClick}
              title="Open menu"
            >
              <Menu size={22} />
            </button>

            <h6 className="welcome-text">
              Welcome, {user.name || "Student"}
            </h6>
          </div>

          {/* RIGHT */}
          <div className="topbar-right">

            {/* Notifications */}
            <button className="icon-btn position-relative">
              <Bell size={20} />
              <span className="notify-badge">1</span>
            </button>

            {/* Settings */}
            <button className="icon-btn">
              <Settings size={20} />
            </button>

            {/* User */}
            <div className="user-box">
              <div className="avatar">
                {user.name?.[0] || "S"}
              </div>
              <div className="user-info d-none d-sm-block">
                <div className="user-name">{user.name || "Student"}</div>
                <div className="user-role">{user.role || "student"}</div>
              </div>
            </div>

            {/* Logout */}
            <button
              className="icon-btn logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={20} />
            </button>

          </div>
        </div>
      </header>

      {/* ================= INTERNAL CSS ================= */}
      <style>{`
        * {
          font-family: 'Inter', sans-serif;
        }

        /* TOPBAR */
        .student-topbar {
          height: 64px;
          background: #ffffff;
          border-bottom: 1px solid #e5d3cf;
          position: sticky;
          top: 0;
          z-index: 900;
          display: flex;
          align-items: center;
        }

        .topbar-inner {
          width: 100%;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* LEFT */
        .topbar-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .welcome-text {
          margin: 0;
          font-weight: 600;
          color: #7a1f2b;
          white-space: nowrap;
        }

        /* RIGHT */
        .topbar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        /* ICON BUTTONS */
        .icon-btn {
          background: transparent;
          border: none;
          color: #7a1f2b;
          padding: 6px;
          border-radius: 8px;
          transition: background 0.2s ease;
          cursor: pointer;
        }

        .icon-btn:hover {
          background: #f3e6e4;
        }

        .logout-btn:hover {
          background: #b91c1c;
          color: #ffffff;
        }

        /* NOTIFICATION BADGE */
        .notify-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #7a1f2b;
          color: #ffffff;
          font-size: 0.65rem;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* USER */
        .user-box {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding-left: 0.8rem;
          border-left: 1px solid #e5d3cf;
        }

        .avatar {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #7a1f2b, #4a2c2a);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 700;
        }

        .user-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #5b1620;
        }

        .user-role {
          font-size: 0.7rem;
          color: #8a5a55;
          text-transform: capitalize;
        }

        /* MOBILE */
        @media (max-width: 576px) {
          .welcome-text {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default StudentTopbar;
