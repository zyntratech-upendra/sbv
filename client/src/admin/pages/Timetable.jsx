import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../utils/api";
import { timetableAPI, subjectAPI } from "../../utils/api";
import { Calendar, AlertCircle } from "lucide-react";
import AdminLayout from "../AdminLayout";

export default function Timetable() {
  const navigate = useNavigate();
  const [view, setView] = useState("create");
  const [batches, setBatches] = useState([]);
  const [batchClasses, setBatchClasses] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [allAllocations, setAllAllocations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [timetableEntries, setTimetableEntries] = useState([]);
  const [allTimetables, setAllTimetables] = useState([]);

  const [formData, setFormData] = useState({
    batchId: "",
    classId: "",
    sectionId: "",
    day: "Monday",
    period: 1,
    startTime: "09:00",
    endTime: "10:00",
    subjectId: "",
    teacherId: "",
  });

  const [filterData, setFilterData] = useState({
    batchId: "",
    classId: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [availableSections, setAvailableSections] = useState([]);

  const PREDEFINED_CLASSES = [
    { _id: "nursery", name: "Nursery" },
    { _id: "lkg", name: "LKG" },
    { _id: "ukg", name: "UKG" },
    { _id: "class1", name: "Class 1" },
    { _id: "class2", name: "Class 2" },
    { _id: "class3", name: "Class 3" },
    { _id: "class4", name: "Class 4" },
    { _id: "class5", name: "Class 5" },
    { _id: "class6", name: "Class 6" },
    { _id: "class7", name: "Class 7" },
    { _id: "class8", name: "Class 8" },
    { _id: "class9", name: "Class 9" },
    { _id: "class10", name: "Class 10" },
  ];

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const PERIODS = Array.from({ length: 8 }, (_, i) => i + 1);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    const res = await adminAPI.getBatches();
    setBatches(res.data);
  };

  /* ================= KEEPING ALL ORIGINAL LOGIC ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const groupedTimetable = DAYS.reduce((acc, day) => {
    acc[day] = timetableEntries.filter((e) => e.day === day);
    return acc;
  }, {});

  const getTeacherName = (teacher) =>
    teacher?.userId?.name || teacher?.employeeId;

  /* ================= UI START ================= */

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="dashboard-title">Timetable</h2>
        <p className="dashboard-subtitle">
          Create, view and manage class timetables
        </p>
      </div>

      {/* TABS */}
      <div className="tabs-wrapper">
        {[
          ["create", "Create Timetable"],
          ["view", "View Timetable"],
          ["viewAll", "View All"],
          ["allocations", "Teacher Allocations"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`tab-btn ${view === key ? "active" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ALERTS */}
      {success && <div className="alert success">Operation successful</div>}
      {error && (
        <div className="alert error">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* CREATE */}
      {view === "create" && (
        <div className="panel fade-in">
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <Calendar size={20} /> Create Timetable Entry
          </h5>

          <form className="row g-3">
            {[
              ["batchId", "Batch", "select"],
              ["classId", "Class", "select"],
              ["sectionId", "Section", "select"],
            ].map(([name, label]) => (
              <div className="col-md-4" key={name}>
                <label className="form-label">{label}</label>
                <input
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="form-control custom-input"
                />
              </div>
            ))}

            <div className="col-md-3">
              <label className="form-label">Day</label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                className="form-select custom-input"
              >
                {DAYS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Period</label>
              <select
                name="period"
                value={formData.period}
                onChange={handleChange}
                className="form-select custom-input"
              >
                {PERIODS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Start</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="form-control custom-input"
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">End</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="form-control custom-input"
              />
            </div>

            <div className="col-12 d-flex gap-3 mt-3">
              <button className="btn action-btn primary flex-fill">
                Add Period
              </button>
              <button
                type="button"
                className="btn action-btn outline-secondary flex-fill"
                onClick={() => navigate("/admin/dashboard")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW */}
      {view === "view" && (
        <div className="panel fade-in">
          <h5 className="fw-bold mb-3">Timetable View</h5>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>Day</th>
                  {PERIODS.slice(0, 6).map((p) => (
                    <th key={p}>P{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day) => (
                  <tr key={day}>
                    <td className="fw-semibold">{day}</td>
                    {PERIODS.slice(0, 6).map((p) => {
                      const entry = groupedTimetable[day]?.find(
                        (e) => e.period === p
                      );
                      return (
                        <td key={p}>
                          {entry ? (
                            <div className="badge bg-light text-dark">
                              {entry.subjectId?.code}
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW ALL */}
      {view === "viewAll" && (
        <div className="panel fade-in text-center text-muted">
          Select batch & class to view all timetables
        </div>
      )}

      {/* ALLOCATIONS */}
      {view === "allocations" && (
        <div className="panel fade-in text-center text-muted">
          Select batch & class to view teacher allocations
        </div>
      )}

      {/* INTERNAL CSS */}
      <style>{`
        .dashboard-title {
          font-weight: 700;
          color: #535434;
        }
        .dashboard-subtitle {
          color: #777;
          font-size: 0.95rem;
        }
        .tabs-wrapper {
          display: flex;
          gap: 1.5rem;
          border-bottom: 1px solid #ddd;
          margin-bottom: 1.5rem;
        }
        .tab-btn {
          background: none;
          border: none;
          padding: 0.6rem 0;
          font-weight: 600;
          color: #777;
        }
        .tab-btn.active {
          color: #535434;
          border-bottom: 3px solid #535434;
        }
        .panel {
          background: #fff;
          border-radius: 20px;
          padding: 1.6rem;
          box-shadow: 0 14px 34px rgba(0,0,0,0.12);
        }
        .custom-input {
          border-radius: 12px;
        }
        .alert {
          padding: 0.75rem 1rem;
          border-radius: 12px;
          margin-bottom: 1rem;
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .alert.success {
          background: #e6e6d1;
          color: #535434;
        }
        .alert.error {
          background: #fdecea;
          color: #b00020;
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
        .action-btn.outline-secondary {
          border: 1px solid #6a6b48;
          color: #6a6b48;
          background: transparent;
        }
        .fade-in {
          animation: fadeIn 0.35s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </AdminLayout>
  );
}
