import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { subjectAPI } from "../../utils/api";
import { adminAPI } from "../../utils/api";
import { Plus, Trash2, AlertCircle, BookOpen } from "lucide-react";
import AdminLayout from "../AdminLayout";

export default function CreateSubject() {
  const navigate = useNavigate();
  const [view, setView] = useState("create"); // "create", "list", "allocate"
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [batches, setBatches] = useState([]);
  const [allocationData, setAllocationData] = useState({
    batchId: "",
    classId: "",
    selectedSubjects: [],
  });
  const [batchClassesForAllocation, setBatchClassesForAllocation] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  // Fetch data on mount
  useEffect(() => {
    fetchSubjects();
    fetchBatches();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await subjectAPI.getAll();
      setSubjects(response.data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await adminAPI.getBatches();
      setBatches(response.data);
    } catch (err) {
      console.error("Error fetching batches:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await subjectAPI.create(formData);
      setSuccess(true);
      setFormData({
        name: "",
        code: "",
        description: "",
      });
      fetchSubjects();
      setTimeout(() => {
        setSuccess(false);
        setView("list");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating subject");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    try {
      await subjectAPI.delete(id);
      fetchSubjects();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting subject");
    }
  };

  const handleSubjectToggle = (subjectId) => {
    setAllocationData((prev) => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(subjectId)
        ? prev.selectedSubjects.filter((id) => id !== subjectId)
        : [...prev.selectedSubjects, subjectId],
    }));
  };

  const handleBatchChangeForAllocation = (e) => {
    const batchId = e.target.value;
    setAllocationData((prev) => ({
      ...prev,
      batchId,
      classId: "",
    }));

    // Get classes for this batch
    const selectedBatch = batches.find((b) => b._id === batchId);
    if (selectedBatch && selectedBatch.classes) {
      const classIds = selectedBatch.classes.map((c) => c.classId);
      const classes = PREDEFINED_CLASSES.filter((c) => classIds.includes(c._id));
      setBatchClassesForAllocation(classes);
    } else {
      setBatchClassesForAllocation([]);
    }
  };

  const handleAllocateSubjects = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!allocationData.batchId || !allocationData.classId || allocationData.selectedSubjects.length === 0) {
        setError("Please select batch, class, and at least one subject");
        setLoading(false);
        return;
      }

      await subjectAPI.allocate({
        batchId: allocationData.batchId,
        classId: allocationData.classId,
        subjectIds: allocationData.selectedSubjects,
      });

      setSuccess(true);
      setAllocationData({
        batchId: "",
        classId: "",
        selectedSubjects: [],
      });
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error allocating subjects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* ================= HEADER ================= */}
      <div className="mb-4">
        <h2 className="dashboard-title flex items-center gap-2">
          <BookOpen size={24} />
          Subjects
        </h2>
        <p className="dashboard-subtitle">Manage subjects and class allocations</p>
      </div>

      {/* ================= TABS ================= */}
      <div className="tabs-wrapper">
        {["create", "list", "allocate"].map((t) => (
          <button
            key={t}
            onClick={() => setView(t)}
            className={`tab-btn ${view === t ? "active" : ""}`}
          >
            {t === "create" ? "Create Subject" : t === "list" ? "View Subjects" : "Allocate to Classes"}
          </button>
        ))}
      </div>

      {/* ================= CREATE SUBJECT FORM ================= */}
      {view === "create" && (
        <div className="panel fade-in">
          {success && (
            <div className="alert success">
              ✓ Subject created successfully!
            </div>
          )}

          {error && (
            <div className="alert error">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Subject Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Mathematics"
                className="form-control custom-input"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Subject Code *</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="MATH"
                className="form-control custom-input"
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Subject description"
                rows="3"
                className="form-control custom-input"
              />
            </div>

            <div className="col-12 d-flex gap-3 mt-3">
              <button
                className="btn action-btn primary flex-fill"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Subject"}
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

      {/* ================= SUBJECTS LIST ================= */}
      {view === "list" && (
        <div className="panel fade-in">
          {success && (
            <div className="alert success mb-4">
              ✓ Operation successful!
            </div>
          )}

          {error && (
            <div className="alert error mb-4">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {subjects.length > 0 ? (
            <div className="row g-4">
              {subjects.map((subject) => (
                <div key={subject._id} className="col-lg-4 col-md-6">
                  <div className="subject-card">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="subject-name">{subject.name}</h5>
                        <p className="subject-code mb-2">Code: {subject.code}</p>
                        {subject.description && (
                          <p className="subject-desc">{subject.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteSubject(subject._id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete Subject"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted mb-0">No subjects found. Create one to get started!</p>
            </div>
          )}
        </div>
      )}

      {/* ================= ALLOCATE SUBJECTS ================= */}
      {view === "allocate" && (
        <div className="panel fade-in">
          {success && (
            <div className="alert success">
              ✓ Subjects allocated successfully!
            </div>
          )}

          {error && (
            <div className="alert error">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleAllocateSubjects} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Select Batch *</label>
              <select
                value={allocationData.batchId}
                onChange={handleBatchChangeForAllocation}
                className="form-select custom-input"
                required
              >
                <option value="">Choose a batch</option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Select Class *</label>
              <select
                value={allocationData.classId}
                onChange={(e) =>
                  setAllocationData((prev) => ({
                    ...prev,
                    classId: e.target.value,
                  }))
                }
                className="form-select custom-input"
                required
                disabled={!allocationData.batchId}
              >
                <option value="">Choose a class</option>
                {batchClassesForAllocation.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label mb-3">Select Subjects *</label>
              <div className="row g-3">
                {subjects.map((subject) => (
                  <div key={subject._id} className="col-md-6 col-lg-4">
                    <label className="subject-checkbox">
                      <input
                        type="checkbox"
                        checked={allocationData.selectedSubjects.includes(subject._id)}
                        onChange={() => handleSubjectToggle(subject._id)}
                        className="form-check-input"
                      />
                      <span className="checkmark"></span>
                      <div>
                        <div className="subject-checkbox-name">{subject.name}</div>
                        <small className="text-muted">{subject.code}</small>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12 d-flex gap-3 mt-4">
              <button
                className="btn action-btn primary flex-fill"
                disabled={loading}
              >
                {loading ? "Allocating..." : "Allocate Subjects"}
              </button>
            </div>
          </form>
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
          font-size: 2rem;
        }

        .dashboard-subtitle {
          color: #777;
          font-size: 0.95rem;
          margin: 0;
        }

        .tabs-wrapper {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #ddd;
          padding-bottom: 1rem;
          flex-wrap: wrap;
        }

        .tab-btn {
          background: none;
          border: none;
          padding: 0.6rem 0;
          font-weight: 600;
          color: #777;
          font-size: 0.95rem;
          cursor: pointer;
          transition: color 0.2s;
          white-space: nowrap;
        }

        .tab-btn.active {
          color: #535434;
          border-bottom: 3px solid #535434;
        }

        .tab-btn:hover {
          color: #535434;
        }

        .panel {
          background: #ffffff;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 14px 34px rgba(0,0,0,0.12);
        }

        .custom-input, .form-select {
          border-radius: 12px;
          border: 1px solid #ddd;
          transition: all 0.2s;
        }

        .custom-input:focus, .form-select:focus {
          border-color: #535434;
          box-shadow: 0 0 0 3px rgba(83, 84, 52, 0.1);
        }

        .alert {
          padding: 0.875rem 1.25rem;
          border-radius: 12px;
          margin-bottom: 1.25rem;
          display: flex;
          gap: 0.5rem;
          align-items: center;
          font-weight: 500;
        }

        .alert.success {
          background: #e6e6d1;
          color: #535434;
          border: 1px solid #d4d4a8;
        }

        .alert.error {
          background: #fdecea;
          color: #b00020;
          border: 1px solid #f5c2c7;
        }

        .action-btn {
          border-radius: 14px;
          font-weight: 500;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          transition: all 0.2s;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .action-btn.primary {
          background: #535434;
          color: #fff;
        }

        .action-btn.primary:hover:not(:disabled) {
          background: #45462e;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(83, 84, 52, 0.3);
        }

        .action-btn.outline-secondary {
          border: 1px solid #6a6b48;
          color: #6a6b48;
          background: transparent;
        }

        .action-btn.outline-secondary:hover {
          background: #6a6b48;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(106, 107, 72, 0.3);
        }

        .btn-outline-danger {
          color: #dc3545 !important;
          border-color: #dc3545 !important;
        }

        .btn-outline-danger:hover {
          background-color: #dc3545 !important;
          color: white !important;
        }

        .subject-card {
          background: white;
          border-radius: 12px;
          padding: 1.75rem;
          border: 1px solid #e9ecef;
          transition: all 0.2s;
          height: 100%;
        }

        .subject-card:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }

        .subject-name {
          color: #535434;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
          font-size: 1.25rem;
        }

        .subject-code {
          color: #666;
          font-size: 0.875rem;
          margin: 0;
        }

        .subject-desc {
          color: #777;
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0;
        }

        .subject-checkbox {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }

        .subject-checkbox:hover {
          border-color: #535434;
          box-shadow: 0 4px 12px rgba(83, 84, 52, 0.1);
        }

        .subject-checkbox input:checked + .checkmark {
          background: #535434;
          border-color: #535434;
        }

        .subject-checkbox input:checked + .checkmark::after {
          display: block;
        }

        .subject-checkbox-name {
          font-weight: 500;
          color: #535434;
          margin: 0;
        }

        .form-check-input {
          position: absolute;
          opacity: 0;
        }

        .checkmark {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          border: 2px solid #ddd;
          position: relative;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .checkmark::after {
          content: '';
          position: absolute;
          display: none;
          left: 6px;
          top: 2px;
          width: 5px;
          height: 10px;
          border: solid #fff;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
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

        @media (max-width: 768px) {
          .dashboard-title {
            font-size: 1.5rem;
          }
          
          .panel {
            padding: 1.5rem;
          }
          
          .tabs-wrapper {
            gap: 1rem;
          }
          
          .tab-btn {
            font-size: 0.9rem;
            flex: 1;
          }
        }

        @media (max-width: 576px) {
          .panel {
            padding: 1.25rem;
          }
          
          .tabs-wrapper {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .tab-btn {
            text-align: left;
            padding-left: 0;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
