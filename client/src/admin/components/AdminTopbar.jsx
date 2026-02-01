import { Bell, LogOut, Settings, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminTopbar = ({ onMenuClick, onCollapseToggle }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* ================= TOPBAR ================= */}
      <header className="admin-topbar">
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

            {/* Desktop collapse
            <button
              className="icon-btn d-none d-md-flex"
              onClick={onCollapseToggle}
              title="Toggle sidebar"
            >
              <Menu size={20} />
            </button> */}

            <h6 className="welcome-text">
              Welcome, {user.name || "Admin"}
            </h6>
          </div>

          {/* RIGHT */}
          <div className="topbar-right">

            {/* Notifications */}
            <button className="icon-btn position-relative">
              <Bell size={20} />
              <span className="notify-badge">3</span>
            </button>

            {/* Settings */}
            <button className="icon-btn">
              <Settings size={20} />
            </button>

            {/* User */}
            <div className="user-box">
              <div className="avatar">
                {user.name?.[0] || "A"}
              </div>
              <div className="user-info d-none d-sm-block">
                <div className="user-name">{user.name || "Admin"}</div>
                <div className="user-role">{user.role || "admin"}</div>
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
        .admin-topbar {
          height: 64px;
          background: #ffffff;
          border-bottom: 1px solid #e1e1d0;
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
          color: #535434;
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
          color: #535434;
          padding: 6px;
          border-radius: 8px;
          transition: background 0.2s ease;
        }

        .icon-btn:hover {
          background: #f2f2e4;
        }

        .logout-btn:hover {
          background: #d42f2f;
          color: #e4d9d8;
        }

        /* NOTIFICATION BADGE */
        .notify-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #c0392b;
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
          border-left: 1px solid #ddd;
        }

        .avatar {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #535434, #6a6b48);
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
          color: #535434;
        }

        .user-role {
          font-size: 0.7rem;
          color: #777;
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

export default AdminTopbar;
