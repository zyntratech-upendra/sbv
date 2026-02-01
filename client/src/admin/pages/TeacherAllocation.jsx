import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../utils/api";
import { timetableAPI, subjectAPI } from "../../utils/api";
import { Users, AlertCircle } from "lucide-react";
import AdminLayout from "../AdminLayout";

export default function TeacherAllocation() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [formData, setFormData] = useState({
    batchId: "",
    classId: "",
    sectionId: "",
    subjectId: "",
    teacherId: "",
    startDate: "",
    endDate: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [batchClasses, setBatchClasses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const [availableSections, setAvailableSections] = useState([]);

  useEffect(() => {
    fetchBatches();
    fetchTeachers();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await adminAPI.getBatches();
      setBatches(response.data);
    } catch (err) {
      console.error("Error fetching batches:", err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await adminAPI.getAllTeachers();
      setTeachers(response.data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      batchId,
      classId: "",
      sectionId: "",
    }));
    setAvailableSections([]);

    // Get classes for this batch
    const selectedBatch = batches.find((b) => b._id === batchId);
    if (selectedBatch && selectedBatch.classes) {
      const classIds = selectedBatch.classes.map((c) => c.classId);
      const classes = PREDEFINED_CLASSES.filter((c) => classIds.includes(c._id));
      setBatchClasses(classes);
    }
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      classId,
      sectionId: "",
    }));

    // Calculate available sections based on batch/class
    const selectedBatch = batches.find((b) => b._id === formData.batchId);
    if (selectedBatch && selectedBatch.classes) {
      const classInfo = selectedBatch.classes.find((c) => c.classId === classId);
      if (classInfo) {
        const sections = Array.from(
          { length: classInfo.numberOfSections },
          (_, i) => String.fromCharCode(65 + i)
        );
        setAvailableSections(sections);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Load subjects when section changes
    if (name === "sectionId" && formData.batchId && formData.classId && value) {
      loadSubjectsAndAllocations();
    }
  };

  const loadSubjectsAndAllocations = async () => {
    try {
      if (formData.batchId && formData.classId) {
        // Get subjects allocated to this class
        const subjectsResponse = await subjectAPI.getSubjectsForClass(
          formData.batchId,
          formData.classId
        );
        setSubjects(subjectsResponse.data);

        // Load existing teacher allocations for this section
        const allocationsResponse = await timetableAPI.getTeacherAllocations(
          formData.batchId,
          formData.classId,
          formData.sectionId || "A"
        );
        setAllocations(allocationsResponse.data);
      }
    } catch (err) {
      console.error("Error loading subjects:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (
        !formData.batchId ||
        !formData.classId ||
        !formData.sectionId ||
        !formData.subjectId ||
        !formData.teacherId
      ) {
        setError("Please fill all required fields");
        setLoading(false);
        return;
      }

      await timetableAPI.allocateTeacher({
        batchId: formData.batchId,
        classId: formData.classId,
        sectionId: formData.sectionId,
        subjectId: formData.subjectId,
        teacherId: formData.teacherId,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });

      setSuccess(true);
      setFormData({
        ...formData,
        subjectId: "",
        teacherId: "",
      });

      // Reload allocations
      if (formData.batchId && formData.classId && formData.sectionId) {
        loadSubjectsAndAllocations();
      }

      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error allocating teacher");
    } finally {
      setLoading(false);
    }
  };

  const getTeacherName = (teacher) => {
    if (typeof teacher.userId === "object") {
      return teacher.userId?.name || teacher.employeeId;
    }
    return teacher.employeeId;
  };

  // Get available teachers - exclude already allocated ones for this section
  const getAvailableTeachers = () => {
    const allocatedTeacherIds = allocations.map((a) => a.teacherId._id);
    return teachers.filter((teacher) => !allocatedTeacherIds.includes(teacher._id));
  };

  return (
    <AdminLayout>
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h2 className="dashboard-title flex items-center gap-2">
          <Users size={24} />
          Teacher Allocation
        </h2>
        <p className="dashboard-subtitle">Assign teachers to subjects for batch/class/section</p>
      </div>

      <div className="row g-4">
        {/* ================= ALLOCATION FORM ================= */}
        <div className="col-lg-4">
          <div className="panel fade-in">
            <h3 className="section-title mb-4">Allocate Teacher</h3>

            {success && (
              <div className="alert success mb-4">
                ✓ Teacher allocated successfully!
              </div>
            )}

            {error && (
              <div className="alert error mb-4">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-12">
                <label className="form-label">Batch *</label>
                <select
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleBatchChange}
                  className="form-select custom-input"
                  required
                >
                  <option value="">Select batch</option>
                  {batches.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Class *</label>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleClassChange}
                  className="form-select custom-input"
                  required
                  disabled={!formData.batchId}
                >
                  <option value="">Select class</option>
                  {batchClasses.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Section *</label>
                <select
                  name="sectionId"
                  value={formData.sectionId}
                  onChange={handleChange}
                  className="form-select custom-input"
                  required
                  disabled={!formData.classId || availableSections.length === 0}
                >
                  <option value="">
                    {availableSections.length === 0 ? "No sections" : "Select section"}
                  </option>
                  {availableSections.map((section) => (
                    <option key={section} value={section}>
                      Section {section}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Subject *</label>
                <select
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleChange}
                  className="form-select custom-input"
                  required
                >
                  <option value="">Select subject</option>
                  {subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Teacher *</label>
                <select
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleChange}
                  className="form-select custom-input"
                  required
                  disabled={allocations.length > 0 && getAvailableTeachers().length === 0}
                >
                  <option value="">
                    {allocations.length > 0 && getAvailableTeachers().length === 0
                      ? "All teachers allocated"
                      : "Select teacher"}
                  </option>
                  {getAvailableTeachers().map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {getTeacherName(teacher)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="form-control custom-input"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="form-control custom-input"
                />
              </div>

              <div className="col-12">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn action-btn primary w-100"
                >
                  {loading ? "Allocating..." : "Allocate Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ================= ALLOCATIONS TABLE ================= */}
        <div className="col-lg-8">
          <div className="panel fade-in">
            <h3 className="section-title mb-4">Current Allocations</h3>

            {allocations.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Section</th>
                      <th>Subject</th>
                      <th>Teacher</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations.map((alloc, idx) => (
                      <tr key={idx}>
                        <td><strong>Section {alloc.sectionId}</strong></td>
                        <td>{alloc.subjectId.name}</td>
                        <td>{getTeacherName(alloc.teacherId)}</td>
                        <td className="text-muted">
                          {alloc.startDate
                            ? new Date(alloc.startDate).toLocaleDateString()
                            : "N/A"}{" "}
                          to{" "}
                          {alloc.endDate
                            ? new Date(alloc.endDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted">
                <p className="mb-0">No allocations yet. Select batch, class, and section to view.</p>
              </div>
            )}
          </div>
        </div>
      </div>

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

        .section-title {
          color: #535434;
          font-weight: 600;
          font-size: 1.25rem;
        }

        .panel {
          background: #ffffff;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 14px 34px rgba(0,0,0,0.12);
          height: 100%;
        }

        .custom-input, .form-select {
          border-radius: 12px;
          border: 1px solid #ddd;
          transition: all 0.2s;
          padding: 0.75rem;
        }

        .custom-input:focus, .form-select:focus {
          border-color: #535434;
          box-shadow: 0 0 0 3px rgba(83, 84, 52, 0.1);
        }

        .alert {
          padding: 0.875rem 1.25rem;
          border-radius: 12px;
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

        .table {
          margin-bottom: 0;
        }

        .table th {
          font-weight: 600;
          color: #535434;
          border-top: none;
          padding: 1rem 0.75rem;
        }

        .table td {
          padding: 1rem 0.75rem;
          vertical-align: middle;
        }

        .table-hover tbody tr:hover {
          background-color: rgba(83, 84, 52, 0.05);
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

        @media (max-width: 992px) {
          .dashboard-title {
            font-size: 1.5rem;
          }
          
          .panel {
            padding: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .col-lg-4, .col-lg-8 {
            width: 100%;
          }
          
          .panel {
            margin-bottom: 1.5rem;
          }
        }

        @media (max-width: 576px) {
          .panel {
            padding: 1.25rem;
          }
          
          .section-title {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
