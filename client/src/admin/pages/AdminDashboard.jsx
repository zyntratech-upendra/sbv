import { useEffect, useState } from "react";
import { adminAPI } from "../../utils/api";
import { Users, GraduationCap, Layers, Calendar } from "lucide-react";
import AdminLayout from "../AdminLayout";
import StatCard from "../components/StatCard";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    batches: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [students, teachers, classes, batches] = await Promise.all([
        adminAPI.getStudents(),
        adminAPI.getTeachers(),
        adminAPI.getClasses(),
        adminAPI.getBatches(),
      ]);

      setStats({
        students: students.data.length,
        teachers: teachers.data.length,
        classes: classes.data.length,
        batches: batches.data.length,
      });
    } catch (err) {
      console.error("Dashboard stats error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="dashboard-container">

        {/* ================= HEADER ================= */}
        <div className="mb-4">
          <h2 className="dashboard-title">Dashboard</h2>
          <p className="dashboard-subtitle">
            Overview of your school management system
          </p>
        </div>

        {/* ================= STATS ================= */}
        {loading ? (
          <div className="loading-card">Loading dashboard data…</div>
        ) : (
          <div className="row g-4 mb-4">
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Total Students"
                value={stats.students}
                icon={<Users size={22} />}
                accent="#535434"
              />
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Teachers"
                value={stats.teachers}
                icon={<GraduationCap size={22} />}
                accent="#6a6b48"
              />
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Classes"
                value={stats.classes}
                icon={<Layers size={22} />}
                accent="#8b8c62"
              />
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Batches"
                value={stats.batches}
                icon={<Calendar size={22} />}
                accent="#a3a47a"
              />
            </div>
          </div>
        )}

        {/* ================= PANELS ================= */}
        <div className="row g-4">
          {/* Quick Actions */}
          <div className="col-12 col-lg-6">
            <div className="panel">
              <h5 className="panel-title">Quick Actions</h5>
              <div className="action-list">
                <button className="btn action-btn primary">
                  Register Student
                </button>
                <button className="btn action-btn secondary">
                  Register Teacher
                </button>
                <button className="btn action-btn outline">
                  Create Class
                </button>
                <button className="btn action-btn outline-secondary">
                  Create Batch
                </button>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="col-12 col-lg-6">
            <div className="panel">
              <h5 className="panel-title">System Status</h5>

              <StatusItem label="Database" />
              <StatusItem label="Server" />
              <StatusItem label="API" />
            </div>
          </div>
        </div>

        {/* ================= INTERNAL CSS ================= */}
        <style>{`
          * {
            font-family: 'Inter', sans-serif;
          }

          .dashboard-container {
            width: 100%;
            animation: fadeIn 0.4s ease;
          }

          .dashboard-title {
            font-weight: 700;
            color: #535434;
          }

          .dashboard-subtitle {
            color: #777;
            font-size: 0.95rem;
          }

          /* Loading */
          .loading-card {
            background: #ffffff;
            padding: 2rem;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          }

          /* Panels */
          .panel {
            background: #ffffff;
            border-radius: 20px;
            padding: 1.6rem;
            box-shadow: 0 14px 34px rgba(0,0,0,0.12);
            height: 100%;
          }

          .panel-title {
            font-weight: 600;
            margin-bottom: 1rem;
            color: #535434;
          }

          /* Actions */
          .action-list {
            display: grid;
            gap: 0.75rem;
          }

          .action-btn {
            border-radius: 14px;
            font-weight: 500;
            padding: 0.65rem;
          }

          .action-btn.primary {
            background: #535434;
            color: #fff;
          }

          .action-btn.secondary {
            background: #6a6b48;
            color: #fff;
          }

          .action-btn.outline {
            border: 1px solid #535434;
            color: #535434;
            background: transparent;
          }

          .action-btn.outline-secondary {
            border: 1px solid #6a6b48;
            color: #6a6b48;
            background: transparent;
          }

          .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.15);
          }

          /* Status */
          .status-item {
            display: flex;
            justify-content: space-between;
            padding: 0.6rem 0;
            font-size: 0.95rem;
            color: #555;
          }

          .status-badge {
            background: #e6e6d1;
            color: #535434;
            padding: 0.25rem 0.9rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 576px) {
            .panel {
              padding: 1.3rem;
            }
          }
        `}</style>
      </div>
    </AdminLayout>
  );
};

/* ================= SMALL COMPONENT ================= */
const StatusItem = ({ label }) => (
  <div className="status-item">
    <span>{label}</span>
    <span className="status-badge">Active</span>
  </div>
);

export default AdminDashboard;
