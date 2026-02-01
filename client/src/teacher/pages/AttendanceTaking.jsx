import { useState, useEffect } from "react";
import { attendanceAPI, commonAPI, timetableAPI } from "../../utils/api";
import { Check, X, AlertCircle } from "lucide-react";

const AttendanceTaking = () => {
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedPeriod, setSelectedPeriod] = useState("");

  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const teacherId = localStorage.getItem("userId");

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch && selectedClass) {
      fetchSections();
      fetchSubjects();
    }
  }, [selectedBatch, selectedClass]);

  useEffect(() => {
    if (
      selectedBatch &&
      selectedClass &&
      selectedSection &&
      selectedSubject &&
      selectedPeriod
    ) {
      fetchStudents();
      loadExistingAttendance();
    }
  }, [
    selectedBatch,
    selectedClass,
    selectedSection,
    selectedSubject,
    selectedPeriod,
    attendanceDate,
  ]);

  const fetchBatches = async () => {
    const res = await commonAPI.getBatches();
    setBatches(res.data.batches || []);
  };

  const fetchSections = async () => {
    const res = await commonAPI.getSections(selectedBatch, selectedClass);
    setSections(res.data.sections || []);
  };

  const fetchSubjects = async () => {
    const res = await timetableAPI.getTimetable(
      selectedBatch,
      selectedClass,
      selectedSection || ""
    );

    const unique = [
      ...new Map(
        res.data.timetable.map((t) => [t.subjectId._id, t.subjectId])
      ).values(),
    ];
    setSubjects(unique);
  };

  const fetchStudents = async () => {
    const res = await attendanceAPI.getClassStudents({
      batchId: selectedBatch,
      classId: selectedClass,
      sectionId: selectedSection,
    });

    setStudents(res.data.students || []);
    const init = {};
    res.data.students.forEach((s) => (init[s._id] = "absent"));
    setAttendance(init);
  };

  const loadExistingAttendance = async () => {
    try {
      const res = await attendanceAPI.getClassAttendance({
        batchId: selectedBatch,
        classId: selectedClass,
        sectionId: selectedSection,
        date: attendanceDate,
        period: selectedPeriod,
      });

      const map = {};
      res.data.attendance.forEach(
        (r) => (map[r.studentId._id] = r.status)
      );
      setAttendance(map);
    } catch {}
  };

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach((s) => (updated[s._id] = status));
    setAttendance(updated);
  };

  const handleSubmit = async () => {
    if (
      !selectedBatch ||
      !selectedClass ||
      !selectedSection ||
      !selectedSubject ||
      !selectedPeriod
    ) {
      setMessage("Please select all required fields");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      await attendanceAPI.markAttendance({
        batchId: selectedBatch,
        classId: selectedClass,
        sectionId: selectedSection,
        subjectId: selectedSubject,
        teacherId,
        date: attendanceDate,
        period: Number(selectedPeriod),
        attendance: students.map((s) => ({
          studentId: s._id,
          status: attendance[s._id] || "absent",
        })),
      });

      setMessage("Attendance saved successfully");
      setMessageType("success");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to save attendance");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    present: Object.values(attendance).filter((s) => s === "present").length,
    absent: Object.values(attendance).filter((s) => s === "absent").length,
    leave: Object.values(attendance).filter((s) => s === "leave").length,
  };

  return (
    <div className="attendance-container">

      {message && (
        <div
          className={`alert ${
            messageType === "error" ? "alert-danger" : "alert-success"
          } d-flex align-items-center gap-2`}
        >
          <AlertCircle size={18} />
          {message}
        </div>
      )}

      <div className="row g-4">
        {/* FILTERS */}
        <div className="col-lg-4">
          <div className="panel">
            <h6 className="panel-title">Filters</h6>

            <div className="mb-3">
              <label className="form-label">Batch</label>
              <select
                className="form-select"
                value={selectedBatch}
                onChange={(e) => {
                  setSelectedBatch(e.target.value);
                  setSelectedClass("");
                }}
              >
                <option value="">Select batch</option>
                {batches.map((b) => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Class</label>
              <input
                className="form-control"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Section</label>
              <select
                className="form-select"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="">Select section</option>
                {sections.map((s, i) => (
                  <option key={i} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Subject</label>
              <select
                className="form-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Period</label>
              <select
                className="form-select"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="">Select period</option>
                {[1,2,3,4,5,6,7,8].map((p) => (
                  <option key={p} value={p}>Period {p}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* STUDENTS */}
        <div className="col-lg-8">
          {students.length === 0 ? (
            <div className="panel text-center text-muted">
              Select filters to load students
            </div>
          ) : (
            <>
              {/* STATS */}
              <div className="row g-3 mb-3">
                <Stat label="Present" value={stats.present} color="success" />
                <Stat label="Absent" value={stats.absent} color="danger" />
                <Stat label="Leave" value={stats.leave} color="warning" />
              </div>

              {/* QUICK ACTIONS */}
              <div className="panel mb-3">
                <div className="d-flex gap-2">
                  <button className="btn btn-success" onClick={() => handleMarkAll("present")}>
                    <Check size={16} /> All Present
                  </button>
                  <button className="btn btn-danger" onClick={() => handleMarkAll("absent")}>
                    <X size={16} /> All Absent
                  </button>
                  <button className="btn btn-warning" onClick={() => handleMarkAll("leave")}>
                    Leave
                  </button>
                </div>
              </div>

              {/* LIST */}
              <div className="panel">
                {students.map((s) => (
                  <div key={s._id} className="student-row">
                    <div>
                      <div className="fw-semibold">{s.userId.name}</div>
                      <small className="text-muted">{s.registrationNumber}</small>
                    </div>
                    <div className="btn-group">
                      {["present", "absent", "leave"].map((st) => (
                        <button
                          key={st}
                          className={`btn btn-sm ${
                            attendance[s._id] === st
                              ? st === "present"
                                ? "btn-success"
                                : st === "absent"
                                ? "btn-danger"
                                : "btn-warning"
                              : "btn-outline-secondary"
                          }`}
                          onClick={() =>
                            setAttendance((p) => ({ ...p, [s._id]: st }))
                          }
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Submit Attendance"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .panel {
          background: #fff;
          border-radius: 18px;
          padding: 1.4rem;
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
        }

        .panel-title {
          font-weight: 600;
          margin-bottom: 1rem;
          color: #065f46;
        }

        .student-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #eee;
        }

        .student-row:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
};

const Stat = ({ label, value, color }) => (
  <div className="col-md-4">
    <div className={`panel border-start border-4 border-${color}`}>
      <small className="text-muted">{label}</small>
      <h4 className={`text-${color}`}>{value}</h4>
    </div>
  </div>
);

export default AttendanceTaking;
