import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../utils/api";
import { Layers, AlertCircle } from "lucide-react";
import AdminLayout from "../AdminLayout";

export default function CreateClass() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    capacity: 50,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: name === "capacity" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminAPI.createClass(formData);
      setSuccess(true);
      setFormData({ name: "", capacity: 50 });
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* ================= HEADER ================= */}
      <div className="mb-4">
        <h2 className="dashboard-title">Create Class</h2>
        <p className="dashboard-subtitle">
          Set up a new class in the system
        </p>
      </div>

      {/* ================= FORM CARD ================= */}
      <div className="panel fade-in max-width">
        {success && (
          <div className="alert success">
            ✓ Class created successfully! Redirecting…
          </div>
        )}

        {error && (
          <div className="alert error">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Class Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Class 10-A"
              className="form-control custom-input"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="form-control custom-input"
            />
          </div>

          <div className="col-12 d-flex gap-3 mt-3">
            <button
              type="submit"
              disabled={loading}
              className="btn action-btn primary flex-fill"
            >
              {loading ? "Creating..." : "Create Class"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="btn action-btn outline-secondary flex-fill"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* ================= INTERNAL CSS ================= */}
      <style>{`
        * {
          font-family: 'Inter', sans-serif;
        }

        .dashboard-title {
          font-weight: 700;
          color: #535434;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .dashboard-subtitle {
          color: #777;
          font-size: 0.95rem;
        }

        .panel {
          background: #ffffff;
          border-radius: 20px;
          padding: 1.6rem;
          box-shadow: 0 14px 34px rgba(0,0,0,0.12);
        }

        .max-width {
          max-width: 720px;
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
          padding: 0.7rem;
          transition: all 0.25s ease;
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
