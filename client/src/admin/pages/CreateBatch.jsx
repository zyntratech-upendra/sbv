import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../utils/api";
import { Calendar, AlertCircle, Plus, Trash2, Edit2 } from "lucide-react";
import AdminLayout from "../AdminLayout";

export default function CreateBatch() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    batchCode: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [classes, setClasses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(null);
  const [view, setView] = useState("create"); // "create", "list", "edit"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newClassItem, setNewClassItem] = useState({
    classId: "",
    numberOfSections: 1,
    capacity: 50,
  });

  // Predefined classes from Nursery to 10th
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

  // Generate year options (current year + 5 years)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = -1; i <= 5; i++) {
      const year = currentYear + i;
      years.push({
        value: year,
        label: `${year}-${year + 1}`,
      });
    }
    return years;
  };

  const YEAR_OPTIONS = generateYearOptions();

  // Fetch batches on mount
  useEffect(() => {
    fetchBatches();
  }, []);

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

  const handleYearChange = (selectedYear) => {
    const year = parseInt(selectedYear);
    const startDate = new Date(year, 3, 1); // April 1st
    const endDate = new Date(year + 1, 2, 31); // March 31st next year
    const batchCode = `BATCH-${year}`;

    setFormData((prev) => ({
      ...prev,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      name: `${year}-${year + 1}`,
      batchCode: batchCode,
    }));
  };

  const handleAddClass = () => {
    if (!newClassItem.classId) {
      setError("Please select a class");
      return;
    }
    if (classes.find((c) => c.classId === newClassItem.classId)) {
      setError("This class is already added");
      return;
    }
    setClasses([...classes, { ...newClassItem }]);
    setNewClassItem({ classId: "", numberOfSections: 1 });
    setError("");
  };

  const handleRemoveClass = (classId) => {
    setClasses(classes.filter((c) => c.classId !== classId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (classes.length === 0) {
        setError("Please add at least one class");
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        classes,
      };

      if (view === "edit" && currentBatch) {
        await adminAPI.updateBatch(currentBatch._id, payload);
      } else {
        await adminAPI.createBatch(payload);
      }

      setSuccess(true);
      setFormData({
        name: "",
        batchCode: "",
        description: "",
        startDate: "",
        endDate: "",
      });
      setClasses([]);
      setTimeout(() => {
        setView("list");
        fetchBatches();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating/updating batch");
    } finally {
      setLoading(false);
    }
  };

  const handleEditBatch = (batch) => {
    setCurrentBatch(batch);
    setFormData({
      name: batch.name,
      batchCode: batch.batchCode,
      description: batch.description,
      startDate: batch.startDate ? batch.startDate.split("T")[0] : "",
      endDate: batch.endDate ? batch.endDate.split("T")[0] : "",
    });
    setClasses(batch.classes || []);
    setView("edit");
  };

  const handleDeleteBatch = async (batchId) => {
    if (!window.confirm("Are you sure you want to delete this batch?")) return;

    try {
      await adminAPI.deleteBatch(batchId);
      fetchBatches();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting batch");
    }
  };

  const getClassName = (classId) => {
    const classItem = PREDEFINED_CLASSES.find((c) => c._id === classId);
    return classItem ? classItem.name : classId;
  };

  return (
    <AdminLayout>
      {/* ================= HEADER ================= */}
      <div className="mb-4">
        <h2 className="dashboard-title flex items-center gap-2">
          <Calendar size={24} />
          Batches
        </h2>
        <p className="dashboard-subtitle">Manage academic batches and classes</p>
      </div>

      {/* ================= TABS ================= */}
      <div className="tabs-wrapper">
        {["create", "list"].map((t) => (
          <button
            key={t}
            onClick={() => setView(t)}
            className={`tab-btn ${view === t ? "active" : ""}`}
          >
            {t === "create" ? "Create Batch" : "View Batches"}
          </button>
        ))}
      </div>

      {/* ================= CREATE/EDIT FORM ================= */}
      {(view === "create" || view === "edit") && (
        <div className="panel fade-in">
          {success && (
            <div className="alert success">
              ✓ {view === "create" ? "Batch created" : "Batch updated"} successfully!
            </div>
          )}

          {error && (
            <div className="alert error">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="row g-3">
            {/* Academic Year & Batch Name */}
            <div className="col-md-6">
              <label className="form-label">Academic Year *</label>
              <select
                onChange={(e) => handleYearChange(e.target.value)}
                className="form-select custom-input"
                required
              >
                <option value="">Select Academic Year</option>
                {YEAR_OPTIONS.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Batch Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="2024-2025"
                className="form-control custom-input"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-control custom-input"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
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
                placeholder="Batch description"
                rows="3"
                className="form-control custom-input"
              />
            </div>

            {/* ================= CLASSES SECTION ================= */}
            <div className="col-12">
              <h4 className="section-title mb-3">Classes & Sections</h4>
              
              {/* Add Class Form */}
              <div className="add-class-panel mb-4">
                <div className="row g-3">
                  <div className="col-md-4 col-sm-12">
                    <label className="form-label">Select Class *</label>
                    <select
                      value={newClassItem.classId}
                      onChange={(e) =>
                        setNewClassItem({
                          ...newClassItem,
                          classId: e.target.value,
                        })
                      }
                      className="form-select custom-input"
                    >
                      <option value="">Choose a class</option>
                      {PREDEFINED_CLASSES.map((cls) => (
                        <option key={cls._id} value={cls._id}>
                          {cls.name} ({cls.classCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3 col-sm-6">
                    <label className="form-label">Sections *</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={newClassItem.numberOfSections}
                      onChange={(e) =>
                        setNewClassItem({
                          ...newClassItem,
                          numberOfSections: parseInt(e.target.value),
                        })
                      }
                      className="form-control custom-input"
                    />
                  </div>

                  <div className="col-md-3 col-sm-6">
                    <label className="form-label">Capacity/Section *</label>
                    <input
                      type="number"
                      min="1"
                      value={newClassItem.capacity}
                      onChange={(e) =>
                        setNewClassItem({
                          ...newClassItem,
                          capacity: parseInt(e.target.value),
                        })
                      }
                      placeholder="50"
                      className="form-control custom-input"
                    />
                  </div>

                  <div className="col-md-2 col-sm-12 d-flex align-items-end">
                    <button
                      type="button"
                      onClick={handleAddClass}
                      className="btn action-btn primary w-100"
                    >
                      <Plus size={16} className="me-1" />
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Added Classes List */}
              {classes.length > 0 ? (
                <div className="added-classes">
                  <h5 className="mb-3">Added Classes:</h5>
                  <div className="row g-2">
                    {classes.map((classItem, idx) => (
                      <div key={idx} className="col-md-6 col-lg-4">
                        <div className="class-card">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="class-name">{getClassName(classItem.classId)}</h6>
                              <p className="class-details mb-1">
                                Sections: {classItem.numberOfSections} 
                                {Array.from(
                                  { length: classItem.numberOfSections },
                                  (_, i) => String.fromCharCode(65 + i)
                                ).join(", ")}
                              </p>
                              <p className="class-details">Capacity: {classItem.capacity}/section</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveClass(classItem.classId)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-muted text-center py-4">
                  No classes added yet
                </div>
              )}
            </div>

            {/* ================= ACTION BUTTONS ================= */}
            <div className="col-12 d-flex gap-3 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn action-btn primary flex-fill"
              >
                {loading
                  ? "Processing..."
                  : view === "create"
                  ? "Create Batch"
                  : "Update Batch"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setView("list");
                  setFormData({
                    name: "",
                    batchCode: "",
                    description: "",
                    startDate: "",
                    endDate: "",
                  });
                  setClasses([]);
                  setCurrentBatch(null);
                }}
                className="btn action-btn outline-secondary flex-fill"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= BATCHES LIST ================= */}
      {view === "list" && (
        <div className="panel fade-in">
          {success && (
            <div className="alert success mb-4">
              ✓ Operation completed successfully!
            </div>
          )}

          {error && (
            <div className="alert error mb-4">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {batches.length > 0 ? (
            <div className="row g-4">
              {batches.map((batch) => (
                <div key={batch._id} className="col-xl-4 col-lg-6 col-md-12">
                  <div className="batch-card">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="batch-name">{batch.name}</h5>
                        <p className="batch-code">Code: {batch.batchCode}</p>
                      </div>
                      <div className="d-flex gap-1">
                        <button
                          onClick={() => handleEditBatch(batch)}
                          className="btn btn-sm btn-outline-primary"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteBatch(batch._id)}
                          className="btn btn-sm btn-outline-danger"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <small className="text-muted">Start Date</small>
                        <p>{new Date(batch.startDate).toLocaleDateString()}</p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">End Date</small>
                        <p>{new Date(batch.endDate).toLocaleDateString()}</p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Total Strength</small>
                        <p>{batch.strength}</p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Classes</small>
                        <p>{batch.classes?.length || 0}</p>
                      </div>
                    </div>

                    {batch.classes && batch.classes.length > 0 && (
                      <div>
                        <small className="text-muted d-block mb-2">Classes:</small>
                        <div className="d-flex flex-wrap gap-1">
                          {batch.classes.map((classItem, idx) => (
                            <span
                              key={idx}
                              className="badge bg-primary bg-opacity-25 text-primary px-2 py-1"
                            >
                              {classItem.classId?.name || classItem.classId} (
                              {classItem.numberOfSections} sections)
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted mb-0">No batches found. Create one to get started!</p>
            </div>
          )}
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

        .section-title {
          color: #535434;
          font-weight: 600;
          font-size: 1.25rem;
        }

        .add-class-panel {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid #e9ecef;
        }

        .added-classes {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid #e9ecef;
        }

        .class-card, .batch-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid #e9ecef;
          transition: all 0.2s;
          height: 100%;
        }

        .class-card:hover, .batch-card:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }

        .class-name, .batch-name {
          color: #535434;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
        }

        .batch-code, .class-details {
          color: #666;
          font-size: 0.875rem;
          margin: 0;
        }

        .custom-input {
          border-radius: 12px;
          border: 1px solid #ddd;
          transition: all 0.2s;
        }

        .custom-input:focus {
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

        .btn-outline-primary {
          color: #535434 !important;
          border-color: #535434 !important;
        }

        .btn-outline-primary:hover {
          background-color: #535434 !important;
          color: white !important;
        }

        .badge {
          font-size: 0.75rem;
          font-weight: 500;
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
          }
        }

        @media (max-width: 576px) {
          .panel {
            padding: 1.25rem;
          }
          
          .add-class-panel, .added-classes {
            padding: 1.25rem;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
