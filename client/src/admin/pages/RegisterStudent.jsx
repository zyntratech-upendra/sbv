import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../utils/api";
import { UserPlus, AlertCircle, Users } from "lucide-react";
import AdminLayout from "../AdminLayout";

export default function RegisterStudent() {
  const navigate = useNavigate();
  const [view, setView] = useState("register");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
    batchId: "",
    classId: "",
  });

  const [batches, setBatches] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ================= PREDEFINED CLASSES ================= */
  const PREDEFINED_CLASSES = [
    { _id: "nursery", name: "Nursery", classCode: "NURSERY" },
    { _id: "lkg", name: "LKG", classCode: "LKG" },
    { _id: "ukg", name: "UKG", classCode: "UKG" },
    { _id: "class1", name: "Class 1", classCode: "CLASS-1" },
    { _id: "class2", name: "Class 2", classCode: "CLASS-2" },
    { _id: "class3", name: "Class 3", classCode: "CLASS-3" },
    { _id: "class4", name: "Class 4", classCode: "CLASS-4" },
    { _id: "class5", name: "Class 5", classCode: "CLASS-5" },
    { _id: "class6", name: "Class 6", classCode: "CLASS-6" },
    { _id: "class7", name: "Class 7", classCode: "CLASS-7" },
    { _id: "class8", name: "Class 8", classCode: "CLASS-8" },
    { _id: "class9", name: "Class 9", classCode: "CLASS-9" },
    { _id: "class10", name: "Class 10", classCode: "CLASS-10" },
  ];

  useEffect(() => {
    fetchBatches();
    fetchStudents();
  }, []);

  const fetchBatches = async () => {
    const res = await adminAPI.getBatches();
    setBatches(res.data);
  };

  const fetchStudents = async () => {
    const res = await adminAPI.getAllStudents();
    setStudents(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));

    if (name === "batchId") {
      const batch = batches.find((b) => b._id === value);
      if (batch?.classes) {
        const ids = batch.classes.map((c) => c.classId);
        setFilteredClasses(
          PREDEFINED_CLASSES.filter((c) => ids.includes(c._id))
        );
        setFormData((p) => ({ ...p, classId: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminAPI.registerStudent(formData);
      setSuccess(true);
      fetchStudents();
      setTimeout(() => {
        setSuccess(false);
        setView("view");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error registering student");
    } finally {
      setLoading(false);
    }
  };

  const getClassName = (id) =>
    PREDEFINED_CLASSES.find((c) => c._id === id)?.name || id;

  const getBatchName = (id) =>
    typeof id === "object" ? id?.name : batches.find((b) => b._id === id)?.name;

  return (
    <AdminLayout>
      {/* ================= HEADER ================= */}
      <div className="mb-4">
        <h2 className="dashboard-title">Students</h2>
        <p className="dashboard-subtitle">Manage student registrations</p>
      </div>

      {/* ================= TABS ================= */}
      <div className="tabs-wrapper">
        {["register", "view"].map((t) => (
          <button
            key={t}
            onClick={() => setView(t)}
            className={`tab-btn ${view === t ? "active" : ""}`}
          >
            {t === "register" ? "Register Student" : "View Students"}
          </button>
        ))}
      </div>

      {/* ================= REGISTER FORM ================= */}
      {view === "register" && (
        <div className="panel fade-in">
          {success && (
            <div className="alert success">
              Student registered successfully
            </div>
          )}

          {error && (
            <div className="alert error">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="row g-3">
            {[
              ["name", "Full Name", "text", true],
              ["email", "Email", "email", true],
              ["phone", "Phone", "tel"],
              ["dateOfBirth", "Date of Birth", "date"],
            ].map(([name, label, type, req]) => (
              <div className="col-md-6" key={name}>
                <label className="form-label">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required={req}
                  className="form-control custom-input"
                />
              </div>
            ))}

            <div className="col-md-6">
              <label className="form-label">Batch</label>
              <select
                name="batchId"
                value={formData.batchId}
                onChange={handleChange}
                className="form-select custom-input"
                required
              >
                <option value="">Select batch</option>
                {batches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Class</label>
              <select
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                className="form-select custom-input"
                required
                disabled={!formData.batchId}
              >
                <option value="">Select class</option>
                {filteredClasses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Address</label>
              <textarea
                name="address"
                rows="3"
                className="form-control custom-input"
                onChange={handleChange}
              />
            </div>

            <div className="col-12 d-flex gap-3 mt-3">
              <button
                className="btn action-btn primary flex-fill"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register Student"}
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

      {/* ================= STUDENT LIST ================= */}
      {view === "view" && (
        <div className="panel fade-in">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>Reg No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Batch</th>
                  <th>Class</th>
                  <th>Guardian</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={i}>
                    <td>{s.registrationNumber}</td>
                    <td>{s.userId?.name}</td>
                    <td>{s.userId?.email}</td>
                    <td>{getBatchName(s.batchId)}</td>
                    <td>{getClassName(s.classId)}</td>
                    <td>{s.guardianName || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= INTERNAL CSS ================= */}
      <style>{`
        * {
          font-family: 'Inter', sans-serif;
        }

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
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #ddd;
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
          background: #ffffff;
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

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.15);
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

        @media (max-width: 576px) {
          .panel {
            padding: 1.3rem;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
