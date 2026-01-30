import { useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />

        {/* 👇 ONLY THIS PART SCROLLS */}
        <div className="admin-content">
          {children}
        </div>
      </div>

      <style>{`
        * {
          font-family: 'Inter', sans-serif;
        }

        .admin-layout {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background: #f2f2e4;
        }

        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .admin-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
