import { useState, useEffect } from "react";
import { attendanceAPI, commonAPI } from "../../utils/api";
import { Download, AlertCircle, Calendar } from "lucide-react";

const AttendanceReport = () => {
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);

  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch && selectedClass) fetchSections();
  }, [selectedBatch, selectedClass]);

  const fetchBatches = async () => {
    const res = await commonAPI.getBatches();
    setBatches(res.data || []);
  };

  const fetchSections = async () => {
    const res = await commonAPI.getSections(selectedBatch, selectedClass);
    setSections(res.data.sections || []);
  };

  const handleGenerateReport = async () => {
    if (!selectedBatch || !selectedClass || !startDate || !endDate) {
      setMessage("Please fill all required fields");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setMessage("Start date must be before end date");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await attendanceAPI.getTeacherReport({
        batchId: selectedBatch,
        classId: selectedClass,
        sectionId: selectedSection,
        startDate,
        endDate,
      });

      setReportData(res.data.report || []);
      if (res.data.report.length === 0) {
        setMessage("No attendance records found for selected period");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!reportData.length) return;

    let csv =
      "Reg No,Student Name,Email,Total,Present,Absent,Leave,Attendance %\n";
    reportData.forEach((s) => {
      csv += `"${s.registrationNumber}","${s.name}","${s.email}",${s.total},${s.present},${s.absent},${s.leave},${s.percentage}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="attendance-report">

      {message && (
        <div className="alert alert-warning d-flex align-items-center gap-2">
          <AlertCircle size={18} />
          {message}
        </div>
      )}

      <div className="row g-4">
        {/* FILTERS */}
        <div className="col-lg-4">
          <div className="panel">
            <h6 className="panel-title">Report Filters</h6>

            <div className="mb-3">
              <label className="form-label">Batch</label>
              <select
                className="form-select"
                value={selectedBatch}
                onChange={(e) => {
                  setSelectedBatch(e.target.value);
                  setSelectedClass("");
                  setSelectedSection("");
                }}
              >
                <option value="">Select batch</option>
                {batches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Class</label>
              <input
                className="form-control"
                placeholder="Class name"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Section (Optional)</label>
              <select
                className="form-select"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="">All Sections</option>
                {sections.map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button
              className="btn btn-success w-100"
              onClick={handleGenerateReport}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>

        {/* RESULTS */}
        <div className="col-lg-8">
          {reportData.length === 0 ? (
            <div className="panel text-center text-muted">
              <Calendar size={42} className="mb-2" />
              Generate a report to view attendance data
            </div>
          ) : (
            <>
              {/* STATS */}
              <div className="row g-3 mb-3">
                <Stat label="Students" value={reportData.length} color="primary" />
                <Stat
                  label="Avg Attendance"
                  value={`${(
                    reportData.reduce(
                      (s, r) => s + parseFloat(r.percentage),
                      0
                    ) / reportData.length
                  ).toFixed(2)}%`}
                  color="success"
                />
                <Stat
                  label="Total Present"
                  value={reportData.reduce((s, r) => s + r.present, 0)}
                  color="success"
                />
                <Stat
                  label="Total Absent"
                  value={reportData.reduce((s, r) => s + r.absent, 0)}
                  color="danger"
                />
              </div>

              {/* DOWNLOAD */}
              <div className="panel mb-3 d-flex gap-2">
                <button className="btn btn-outline-success" onClick={downloadCSV}>
                  <Download size={16} /> CSV
                </button>
              </div>

              {/* TABLE */}
              <div className="panel">
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Reg No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th className="text-center">Total</th>
                        <th className="text-center">Present</th>
                        <th className="text-center">Absent</th>
                        <th className="text-center">Leave</th>
                        <th className="text-center">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((s, i) => (
                        <tr key={i}>
                          <td>{s.registrationNumber}</td>
                          <td>{s.name}</td>
                          <td>{s.email}</td>
                          <td className="text-center">{s.total}</td>
                          <td className="text-center text-success fw-semibold">
                            {s.present}
                          </td>
                          <td className="text-center text-danger fw-semibold">
                            {s.absent}
                          </td>
                          <td className="text-center text-warning fw-semibold">
                            {s.leave}
                          </td>
                          <td className="text-center fw-bold">
                            {s.percentage}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
      `}</style>
    </div>
  );
};

const Stat = ({ label, value, color }) => (
  <div className="col-md-3">
    <div className={`panel border-start border-4 border-${color}`}>
      <small className="text-muted">{label}</small>
      <h4 className={`text-${color}`}>{value}</h4>
    </div>
  </div>
);

export default AttendanceReport;
