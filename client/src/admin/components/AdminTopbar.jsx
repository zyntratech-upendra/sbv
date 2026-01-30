import { Menu, UserCircle } from "lucide-react";

const AdminTopbar = ({ onMenuClick }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <header className="admin-topbar">
        <button className="menu-btn" onClick={onMenuClick}>
          <Menu size={22} />
        </button>

        <h5>Admin Dashboard</h5>

        <div className="admin-user">
          <UserCircle size={22} />
          <span>{user?.name || "Admin"}</span>
        </div>
      </header>

      <style>{`
        .admin-topbar {
          background: #fff;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        }

        .menu-btn {
          background: none;
          border: none;
          display: none;
        }

        .admin-user {
          display: flex;
          gap: 8px;
          align-items: center;
          font-weight: 500;
          color: #535434;
        }

        @media (max-width: 991px) {
          .menu-btn {
            display: block;
          }
        }


      `}</style>
    </>
  );
};

export default AdminTopbar;
