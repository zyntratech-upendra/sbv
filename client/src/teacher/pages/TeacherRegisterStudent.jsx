import { useEffect, useState } from "react";
import { studentAPI, commonAPI, teacherAPI } from "../../utils/api";
import { AlertCircle, UserPlus, Users } from "lucide-react";
import TeacherLayout from "../TeacherLayout";

const TeacherRegisterStudent = () => {
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
  const [allClasses, setAllClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setPageLoading(true);
      const [batchRes, classRes, studentRes] = await Promise.all([
        commonAPI.getBatches(),
        commonAPI.getClasses(),
        teacherAPI.getStudents(),
      ]);

      setBatches(batchRes.data || []);
      setAllClasses(classRes.data || []);
      setStudents(studentRes.data || []);
    } catch (err) {
      setMessage("Failed to load data");
      setMessageType("error");
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));

    if (name === "batchId") {
      setFilteredClasses(allClasses.filter((c) => c.batchId === value));
      setFormData((p) => ({ ...p, classId: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await studentAPI.register(formData);
      setMessage("Student registered successfully");
      setMessageType("success");
      setFormData({
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
      fetchInitialData();
      setTimeout(() => setView("view"), 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const getName = (list, id) =>
    typeof id === "object" ? id?.name : list.find((i) => i._id === id)?.name;

  if (pageLoading) {
    return (
      <TeacherLayout>
        <div className="loading-card">Loading data…</div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="dashboard-container">

        {/* HEADER */}
        <div className="mb-4">
          <h2 className="dashboard-title">Student Management</h2>
          <p className="dashboard-subtitle">
            Register new students and manage existing ones
          </p>
        </div>

        {/* TABS */}
        <div className="panel mb-4">
          <div className="tab-nav">
            <button
              className={`tab-btn ${view === "register" ? "active" : ""}`}
              onClick={() => setView("register")}
            >
              <UserPlus size={16} /> Register Student
            </button>
            <button
              className={`tab-btn ${view === "view" ? "active" : ""}`}
              onClick={() => setView("view")}
            >
              <Users size={16} /> View Students
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`alert ${
              messageType === "success" ? "alert-success" : "alert-danger"
            }`}
          >
            {messageType === "error" && <AlertCircle size={18} />}
            {message}
          </div>
        )}

        {/* REGISTER */}
        {view === "register" && (
          <div className="panel">
            <h5 className="panel-title mb-3">Register New Student</h5>

            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name *</label>
                <input
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Batch *</label>
                <select
                  className="form-select"
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select batch</option>
                  {batches.map((b) => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Class *</label>
                <select
                  className="form-select"
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select class</option>
                  {filteredClasses.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Address</label>
                <textarea
                  rows="3"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Guardian Name</label>
                <input
                  className="form-control"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Guardian Phone</label>
                <input
                  className="form-control"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <button className="btn btn-success w-100 py-2" disabled={loading}>
                  {loading ? "Registering…" : "Register Student"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW */}
        {view === "view" && (
          <div className="panel">
            <h5 className="panel-title mb-3">Registered Students</h5>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
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
                      <td>{getName(batches, s.batchId)}</td>
                      <td>{getName(allClasses, s.classId)}</td>
                      <td>{s.guardianName || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CSS */}
        <style>{`
          .dashboard-title {
            font-weight: 700;
            color: #065f46;
          }

          .dashboard-subtitle {
            color: #6b7280;
          }

          .loading-card {
            background: #fff;
            padding: 2rem;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          }

          .panel {
            background: #fff;
            border-radius: 20px;
            padding: 1.6rem;
            box-shadow: 0 14px 34px rgba(0,0,0,0.12);
          }

          .panel-title {
            font-weight: 600;
            color: #065f46;
          }

          .tab-nav {
            display: flex;
            gap: 0.5rem;
          }

          .tab-btn {
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
        `}</style>
      </div>
    </TeacherLayout>
  );
};

export default TeacherRegisterStudent;
