import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../utils/api";
import { BookOpen, AlertCircle, Users } from "lucide-react";
import AdminLayout from "../AdminLayout";

export default function RegisterTeacher() {
  const navigate = useNavigate();
  const [view, setView] = useState("register");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    qualifications: "",
  });

  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await adminAPI.getAllTeachers();
      setTeachers(response.data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminAPI.registerTeacher(formData);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        qualifications: "",
      });
      fetchTeachers();
      setTimeout(() => {
        setSuccess(false);
        setView("view");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error registering teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* ================= HEADER ================= */}
      <div className="mb-4">
        <h2 className="dashboard-title">Teachers</h2>
        <p className="dashboard-subtitle">Manage teacher registrations</p>
      </div>

      {/* ================= TABS ================= */}
      <div className="tabs-wrapper">
        {["register", "view"].map((t) => (
          <button
            key={t}
            onClick={() => setView(t)}
            className={`tab-btn ${view === t ? "active" : ""}`}
          >
            {t === "register" ? "Register Teacher" : "View Teachers"}
          </button>
        ))}
      </div>

      {/* ================= REGISTER ================= */}
      {view === "register" && (
        <div className="panel fade-in">
          {success && (
            <div className="alert success">
              ✓ Teacher registered successfully
            </div>
          )}

          {error && (
            <div className="alert error">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control custom-input"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control custom-input"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control custom-input"
              />
            </div>

            <div className="col-12">
              <label className="form-label">Qualifications</label>
              <textarea
                name="qualifications"
                rows="3"
                value={formData.qualifications}
                onChange={handleChange}
                className="form-control custom-input"
              />
            </div>

            <div className="col-12 d-flex gap-3 mt-3">
              <button
                className="btn action-btn primary flex-fill"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register Teacher"}
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

      {/* ================= VIEW ================= */}
      {view === "view" && (
        <div className="panel fade-in">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Qualifications</th>
                  <th>Specialization</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t, i) => (
                  <tr key={i}>
                    <td>{t.employeeId}</td>
                    <td>{t.userId?.name}</td>
                    <td>{t.userId?.email}</td>
                    <td>{t.userId?.phone}</td>
                    <td>{t.department || "N/A"}</td>
                    <td>{t.qualifications || "N/A"}</td>
                    <td>{t.specialization || "N/A"}</td>
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
