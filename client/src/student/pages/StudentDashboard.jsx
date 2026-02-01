import { useEffect, useState } from "react";
import { studentAPI, attendanceAPI } from "../../utils/api";
import {
  BookOpen,
  Calendar,
  TrendingUp,
  IdCard,
} from "lucide-react";
import StudentLayout from "../StudentLayout";
import StatCard from "../components/StatCard";
import StudentAttendance from "./StudentAttendance";

const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAttendance, setShowAttendance] = useState(false);

  useEffect(() => {
    fetchDashboard();
    fetchAttendanceSummary();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await studentAPI.getDashboard();
      setDashboard(res.data.dashboard);
    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceSummary = async () => {
    try {
      const res = await attendanceAPI.getStudentSummary();
      setAttendanceSummary(res.data.summary);
    } catch (err) {
      console.error("Attendance error", err);
    }
  };

  if (showAttendance) {
    return <StudentAttendance />;
  }

  return (
    <StudentLayout>
      <div className="dashboard-container">

        {/* ================= HEADER ================= */}
        <div className="mb-4">
          <h2 className="dashboard-title">Dashboard</h2>
          <p className="dashboard-subtitle">
            Overview of your academic information
          </p>
        </div>

        {/* ================= STATS ================= */}
        {loading ? (
          <div className="loading-card">Loading dashboard data…</div>
        ) : (
          <div className="row g-4 mb-4">
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Registration No"
                value={dashboard?.registrationNumber || "—"}
                icon={<IdCard size={22} />}
                accent="#7a1f2b"
              />
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Class"
                value={dashboard?.className || "—"}
                icon={<BookOpen size={22} />}
                accent="#4a2c2a"
              />
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Batch"
                value={dashboard?.batchName || "—"}
                icon={<Calendar size={22} />}
                accent="#8b5e57"
              />
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Attendance %"
                value={`${attendanceSummary?.percentage || 0}%`}
                icon={<TrendingUp size={22} />}
                accent="#a16207"
              />
            </div>
          </div>
        )}

        {/* ================= PANELS ================= */}
        <div className="row g-4">
          {/* Academic Info */}
          <div className="col-12 col-lg-6">
            <div className="panel">
              <h5 className="panel-title">Academic Information</h5>

              <InfoRow label="Registration">
                {dashboard?.registrationNumber}
              </InfoRow>

              <InfoRow label="Class">
                {dashboard?.className}
              </InfoRow>

              <InfoRow label="Batch">
                {dashboard?.batchName}
              </InfoRow>

              <InfoRow label="Status">
                <span className="status-badge success">Active</span>
              </InfoRow>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="col-12 col-lg-6">
            <div className="panel">
              <h5 className="panel-title">Attendance Summary</h5>

              <InfoRow label="Total Classes">
                {attendanceSummary?.total || 0}
              </InfoRow>

              <InfoRow label="Present">
                <span className="text-success">
                  {attendanceSummary?.present || 0}
                </span>
              </InfoRow>

              <InfoRow label="Absent">
                <span className="text-danger">
                  {attendanceSummary?.absent || 0}
                </span>
              </InfoRow>

              <InfoRow label="Leave">
                <span className="text-warning">
                  {attendanceSummary?.leave || 0}
                </span>
              </InfoRow>

              <button
                className="btn action-btn primary w-100 mt-3"
                onClick={() => setShowAttendance(true)}
              >
                View Full Attendance
              </button>
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
            color: #7a1f2b;
          }

          .dashboard-subtitle {
            color: #777;
            font-size: 0.95rem;
          }

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
            color: #5b1620;
          }

          /* Info Rows */
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 0.6rem 0;
            border-bottom: 1px solid #eee;
            font-size: 0.95rem;
            color: #555;
          }

          .info-row:last-child {
            border-bottom: none;
          }

          /* Status */
          .status-badge {
            padding: 0.25rem 0.9rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
          }

          .status-badge.success {
            background: #e6f4ea;
            color: #166534;
          }

          /* Buttons */
          .action-btn {
            border-radius: 14px;
            font-weight: 500;
            padding: 0.65rem;
          }

          .action-btn.primary {
            background: #7a1f2b;
            color: #fff;
            border: none;
          }

          .action-btn.primary:hover {
            background: #5b1620;
          }

          /* Text helpers */
          .text-success { color: #166534; }
          .text-danger { color: #b91c1c; }
          .text-warning { color: #a16207; }

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
    </StudentLayout>
  );
};

/* ================= SMALL COMPONENT ================= */
const InfoRow = ({ label, children }) => (
  <div className="info-row">
    <span>{label}</span>
    <strong>{children}</strong>
  </div>
);

export default StudentDashboard;
