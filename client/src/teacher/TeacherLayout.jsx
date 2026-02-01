// TeacherLayout.jsx
import { useState } from "react";
import TeacherSidebar from "./components/TeacherSidebar";
import TeacherTopbar from "./components/TeacherTopbar";

const TeacherLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="teacher-layout">
      <TeacherSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className={`teacher-main ${sidebarCollapsed ? "collapsed" : ""}`}>
        <TeacherTopbar
          onMenuClick={() => setMobileSidebarOpen(true)}
          onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="teacher-content">
          {children}
        </main>
      </div>

      <style>{`
        * {
          font-family: 'Inter', sans-serif;
        }

        .teacher-layout {
          height: 100vh;
          overflow: hidden;
          background: #f4f7fb;
        }

        .teacher-main {
          margin-left: 260px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.3s ease;
        }

        .teacher-main.collapsed {
          margin-left: 80px;
        }

        .teacher-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          background: #f4f7fb;
        }

        @media (max-width: 768px) {
          .teacher-main,
          .teacher-main.collapsed {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherLayout;
