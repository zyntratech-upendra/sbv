// StudentLayout.jsx
import { useState } from "react";
import StudentSidebar from "./components/StudentSidebar";
import StudentTopbar from "./components/StudentTopbar";

const StudentLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="student-layout">
      <StudentSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className={`student-main ${sidebarCollapsed ? "collapsed" : ""}`}>
        <StudentTopbar
          onMenuClick={() => setMobileSidebarOpen(true)}
          onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="student-content">
          {children}
        </main>
      </div>

      <style>{`
        * {
          font-family: 'Inter', sans-serif;
        }

        .student-layout {
          height: 100vh;
          overflow: hidden;
          background: #f2f2e4;
        }

        .student-main {
          margin-left: 240px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.3s ease;
        }

        .student-main.collapsed {
          margin-left: 72px;
        }

        .student-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          background: #f2f2e4;
        }

        @media (max-width: 768px) {
          .student-main,
          .student-main.collapsed {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentLayout;
