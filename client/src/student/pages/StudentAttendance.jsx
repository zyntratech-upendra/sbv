import { useEffect, useState } from "react";
import { attendanceAPI, studentAPI } from "../../utils/api";
import { Calendar, AlertCircle, TrendingUp } from "lucide-react";
import StudentLayout from "../StudentLayout";
import StatCard from "../components/StatCard";

const StudentAttendance = () => {
  const [studentId, setStudentId] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    leave: 0,
    percentage: 0,
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const res = await studentAPI.getProfile();
      const id = res.data.profile._id;
      setStudentId(id);
      fetchAttendance(id);
    } catch (err) {
      setMessage("Unable to load student info. Please login again.");
      setLoading(false);
    }
  };

  const fetchAttendance = async (id, start = "", end = "") => {
    setLoading(true);
    setMessage("");

    try {
      const params = {};
      if (start) params.startDate = start;
      if (end) params.endDate = end;

      const res = await attendanceAPI.getStudentAttendance(id, params);
      setAttendance(res.data.attendance || []);
      setStats(res.data.statistics || {});
    } catch (err) {
      setMessage("Failed to fetch attendance records");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (!startDate || !endDate) {
      setMessage("Please select both dates");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setMessage("Start date must be before end date");
      return;
    }
    fetchAttendance(studentId, startDate, endDate);
  };

  const resetFilter = () => {
    setStartDate("");
    setEndDate("");
    fetchAttendance(studentId);
  };

  const groupedByDate = attendance.reduce((acc, record) => {
    const date = new Date(record.date).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    acc[date] = acc[date] || [];
    acc[date].push(record);
    return acc;
  }, {});

  return (
    <StudentLayout>
      <div className="attendance-container">

        {/* ================= HEADER ================= */}
        <div className="mb-4">
          <h2 className="page-title">Attendance</h2>
          <p className="page-subtitle">
            Track your attendance and performance
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="row g-4 mb-4">
          <div className="col-6 col-lg-2">
            <StatCard title="Total" value={stats.total} accent="#7a1f2b" />
          </div>
          <div className="col-6 col-lg-2">
            <StatCard title="Present" value={stats.present} accent="#166534" />
          </div>
          <div className="col-6 col-lg-2">
            <StatCard title="Absent" value={stats.absent} accent="#b91c1c" />
          </div>
          <div className="col-6 col-lg-2">
            <StatCard title="Leave" value={stats.leave} accent="#a16207" />
          </div>
          <div className="col-12 col-lg-4">
            <StatCard
              title="Attendance %"
              value={`${stats.percentage || 0}%`}
              icon={<TrendingUp size={20} />}
              accent="#4a2c2a"
            />
          </div>
        </div>

        {/* ================= FILTER ================= */}
        <div className="panel mb-4">
          <h5 className="panel-title">Filter by Date</h5>
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-4">
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="col-12 col-md-4">
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="col-12 col-md-4 d-flex gap-2">
              <button className="btn action-btn primary w-100" onClick={applyFilter}>
                Filter
              </button>
              <button className="btn action-btn outline w-100" onClick={resetFilter}>
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* ================= ALERT ================= */}
        {message && (
          <div className="alert-box">
            <AlertCircle size={18} /> {message}
          </div>
        )}

        {/* ================= RECORDS ================= */}
        {loading ? (
          <div className="loading-card">Loading attendance records…</div>
        ) : attendance.length ? (
          Object.entries(groupedByDate).map(([date, records]) => (
            <div key={date} className="panel mb-3">
              <h6 className="panel-title">
                <Calendar size={16} /> {date}
              </h6>

              {records.map((r, i) => (
                <div key={i} className={`attendance-row ${r.status}`}>
                  <span>
                    Period {r.period} – {r.subjectId?.name}
                  </span>
                  <strong>{r.status}</strong>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="panel text-center">No attendance records found</div>
        )}

        {/* ================= CSS ================= */}
        <style>{`
          * { font-family: 'Inter', sans-serif; }

          .attendance-container { animation: fadeIn .4s ease; }

          .page-title { font-weight: 700; color: #7a1f2b; }
          .page-subtitle { color: #777; }

          .panel {
            background: #fff;
            border-radius: 18px;
            padding: 1.5rem;
            box-shadow: 0 14px 34px rgba(0,0,0,.12);
          }

          .panel-title {
            font-weight: 600;
            color: #5b1620;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: .5rem;
          }

          .attendance-row {
            display: flex;
            justify-content: space-between;
            padding: .6rem 0;
            border-bottom: 1px solid #eee;
          }

          .attendance-row.present { color: #166534; }
          .attendance-row.absent { color: #b91c1c; }
          .attendance-row.leave { color: #a16207; }

          .alert-box {
            background: #fff3cd;
            color: #856404;
            padding: .75rem 1rem;
            border-radius: 12px;
            margin-bottom: 1rem;
            display: flex;
            gap: .5rem;
            align-items: center;
          }

          .loading-card {
            background: #fff;
            padding: 2rem;
            text-align: center;
            border-radius: 16px;
          }

          .action-btn.primary {
            background: #7a1f2b;
            color: #fff;
          }

          .action-btn.outline {
            border: 1px solid #7a1f2b;
            color: #7a1f2b;
            background: transparent;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

      </div>
    </StudentLayout>
  );
};

export default StudentAttendance;
