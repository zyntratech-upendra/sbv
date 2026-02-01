import { useState, useEffect } from "react";
import { attendanceAPI, commonAPI } from "../../utils/api";
import { Download, AlertCircle, Calendar } from "lucide-react";

export default function AttendanceReport() {
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
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
    if (selectedBatch && selectedClass) {
      fetchSections();
    }
  }, [selectedBatch, selectedClass]);

  const fetchBatches = async () => {
    try {
      const response = await commonAPI.getBatches();
      setBatches(response.data || []);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await commonAPI.getSections(selectedBatch, selectedClass);
      setSections(response.data.sections || []);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
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
      const response = await attendanceAPI.getTeacherReport({
        batchId: selectedBatch,
        classId: selectedClass,
        sectionId: selectedSection,
        startDate,
        endDate,
      });

      setReportData(response.data.report || []);
      if (response.data.report.length === 0) {
        setMessage("No attendance records found for the selected period");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error generating report");
    } finally {
      setLoading(false);
    }
  };

  const downloadAsCSV = () => {
    if (reportData.length === 0) {
      setMessage("No data to download");
      return;
    }

    let csv = "Registration Number,Student Name,Email,Total Classes,Present,Absent,Leave,Attendance %\n";

    reportData.forEach((student) => {
      csv += `"${student.registrationNumber}","${student.name}","${student.email}",${student.total},${student.present},${student.absent},${student.leave},${student.percentage}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-report-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const downloadAsPDF = () => {
    if (reportData.length === 0) {
      setMessage("No data to download");
      return;
    }

    // Basic PDF generation using HTML to PDF conversion
    const printWindow = window.open("", "", "height=400,width=800");
    let html = `
      <html>
        <head>
          <title>Attendance Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #4CAF50; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .summary { margin-top: 20px; padding: 10px; background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          <h1>Attendance Report</h1>
          <p><strong>Period:</strong> ${startDate} to ${endDate}</p>
          <table>
            <thead>
              <tr>
                <th>Registration Number</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>Total</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Leave</th>
                <th>Attendance %</th>
              </tr>
            </thead>
            <tbody>
    `;

    reportData.forEach((student) => {
      html += `
        <tr>
          <td>${student.registrationNumber}</td>
          <td>${student.name}</td>
          <td>${student.email}</td>
          <td>${student.total}</td>
          <td>${student.present}</td>
          <td>${student.absent}</td>
          <td>${student.leave}</td>
          <td>${student.percentage}%</td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
          <div class="summary">
            <p><strong>Total Students:</strong> ${reportData.length}</p>
            <p><strong>Average Attendance:</strong> ${(
              reportData.reduce((sum, s) => sum + parseFloat(s.percentage), 0) / reportData.length
            ).toFixed(2)}%</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Attendance Report</h1>
      <p className="text-gray-600 mb-8">Generate and download attendance reports by class and date range</p>

      {message && (
        <div className="mb-6 p-4 rounded-lg bg-yellow-100 text-yellow-700 border border-yellow-300 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Report Filters</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
              <select
                value={selectedBatch}
                onChange={(e) => {
                  setSelectedBatch(e.target.value);
                  setSelectedClass("");
                  setSelectedSection("");
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Batch</option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <input
                type="text"
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSelectedSection("");
                }}
                placeholder="Enter class (e.g., Class 10)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section (Optional)</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sections</option>
                {sections.map((section, idx) => (
                  <option key={idx} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium transition"
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>

        {/* Report Results */}
        <div className="lg:col-span-3">
          {reportData.length > 0 ? (
            <>
              {/* Statistics */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-blue-500">
                  <p className="text-gray-600 text-sm">Total Students</p>
                  <p className="text-2xl font-bold text-blue-600">{reportData.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-green-500">
                  <p className="text-gray-600 text-sm">Avg. Attendance</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(
                      reportData.reduce((sum, s) => sum + parseFloat(s.percentage), 0) /
                      reportData.length
                    ).toFixed(2)}
                    %
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-purple-500">
                  <p className="text-gray-600 text-sm">Total Present</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {reportData.reduce((sum, s) => sum + s.present, 0)}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-red-500">
                  <p className="text-gray-600 text-sm">Total Absent</p>
                  <p className="text-2xl font-bold text-red-600">
                    {reportData.reduce((sum, s) => sum + s.absent, 0)}
                  </p>
                </div>
              </div>

              {/* Download buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={downloadAsCSV}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </button>
                <button
                  onClick={downloadAsPDF}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>

              {/* Table */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Student Attendance Details
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 border-b">
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Reg. No.</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Email</th>
                        <th className="px-4 py-2 text-center font-medium text-gray-700">Total</th>
                        <th className="px-4 py-2 text-center font-medium text-gray-700">
                          <span className="text-green-600">Present</span>
                        </th>
                        <th className="px-4 py-2 text-center font-medium text-gray-700">
                          <span className="text-red-600">Absent</span>
                        </th>
                        <th className="px-4 py-2 text-center font-medium text-gray-700">
                          <span className="text-yellow-600">Leave</span>
                        </th>
                        <th className="px-4 py-2 text-center font-medium text-gray-700">Attendance %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((student, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-gray-800">{student.registrationNumber}</td>
                          <td className="px-4 py-3 text-gray-800">{student.name}</td>
                          <td className="px-4 py-3 text-gray-600">{student.email}</td>
                          <td className="px-4 py-3 text-center text-gray-800">{student.total}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                              {student.present}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                              {student.absent}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                              {student.leave}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center font-semibold text-gray-800">
                            {student.percentage}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Select filters and generate a report to view attendance data
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
