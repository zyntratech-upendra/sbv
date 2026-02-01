import { useState, useEffect } from "react";
import { teacherAPI } from "../../utils/api";
import {
  Users,
  BookOpen,
  ClipboardList,
  BarChart3,
  UserPlus,
} from "lucide-react";
import TeacherLayout from "../TeacherLayout";
import StatCard from "../components/StatCard";
import AttendanceTaking from "./AttendanceTaking";
import AttendanceReport from "./AttendanceReport";

const TeacherDashboard = () => {
  const [stats, setStats] = useState({ students: 0, classes: 0 });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await teacherAPI.getStudents();
      const list = res.data || [];

      setStudents(list);
      setStats({
        students: list.length,
        classes: new Set(list.map((s) => s.classId?.name)).size,
      });
    } catch (err) {
      console.error("Teacher dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="dashboard-container">

        {/* ================= HEADER ================= */}
        <div className="mb-4">
          <h2 className="dashboard-title">Teacher Dashboard</h2>
          <p className="dashboard-subtitle">
            Manage your classes, students, and attendance
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
                accent="#0f766e"
              />
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Classes"
                value={stats.classes}
                icon={<BookOpen size={22} />}
                accent="#115e59"
              />
            </div>
          </div>
        )}

        {/* ================= TABS ================= */}
        <div className="panel mb-4">
          <div className="tab-nav">
            <button
              onClick={() => setActiveTab("overview")}
              className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            >
              <Users size={16} /> Overview
            </button>

            <button
              onClick={() => setActiveTab("register")}
              className={`tab-btn ${activeTab === "register" ? "active" : ""}`}
            >
              <UserPlus size={16} /> Register Student
            </button>

            <button
              onClick={() => setActiveTab("attendance")}
              className={`tab-btn ${activeTab === "attendance" ? "active" : ""}`}
            >
              <ClipboardList size={16} /> Attendance
            </button>

            <button
              onClick={() => setActiveTab("report")}
              className={`tab-btn ${activeTab === "report" ? "active" : ""}`}
            >
              <BarChart3 size={16} /> Report
            </button>
          </div>
        </div>

        {/* ================= TAB CONTENT ================= */}
        {activeTab === "overview" && (
          <div className="panel">
            <h5 className="panel-title mb-3">Your Students</h5>

            {students.length ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Class</th>
                      <th>Reg. No</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={i}>
                        <td>{s.userId?.name}</td>
                        <td>{s.userId?.email}</td>
                        <td>{s.classId?.name}</td>
                        <td>{s.registrationNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted text-center py-4">
                No students assigned yet
              </p>
            )}
          </div>
        )}

        {activeTab === "register" && (
          <div className="panel">
            <h5 className="panel-title">Register Student</h5>
            <p className="text-muted text-center py-5">
              Student registration form will appear here
            </p>
          </div>
        )}

        {activeTab === "attendance" && <AttendanceTaking />}
        {activeTab === "report" && <AttendanceReport />}

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
            color: #065f46;
          }

          .dashboard-subtitle {
            color: #6b7280;
            font-size: 0.95rem;
          }

          .loading-card {
            background: #ffffff;
            padding: 2rem;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          }

          .panel {
            background: #ffffff;
            border-radius: 20px;
            padding: 1.6rem;
            box-shadow: 0 14px 34px rgba(0,0,0,0.12);
          }

          .panel-title {
            font-weight: 600;
            color: #065f46;
          }

          /* Tabs */
          .tab-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .tab-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            border: none;
            background: transparent;
            padding: 0.6rem 1rem;
            border-radius: 12px;
            color: #065f46;
            font-weight: 500;
          }

          .tab-btn.active {
            background: #99f6e4;
            color: #064e3b;
          }

          .tab-btn:hover {
            background: #ecfdf5;
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
        `}</style>
      </div>
    </TeacherLayout>
  );
};

export default TeacherDashboard;
