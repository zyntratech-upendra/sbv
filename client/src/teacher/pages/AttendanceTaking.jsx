import { useState, useEffect } from "react";
import { attendanceAPI, commonAPI, timetableAPI } from "../../utils/api";
import { Check, X, AlertCircle, Download } from "lucide-react";

export default function AttendanceTaking() {
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
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

  // Get teacher ID from localStorage
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
    if (selectedBatch && selectedClass && selectedSection && selectedSubject) {
      fetchStudents();
      loadExistingAttendance();
    }
  }, [selectedBatch, selectedClass, selectedSection, selectedSubject, attendanceDate, selectedPeriod]);

  const fetchBatches = async () => {
    try {
      const response = await commonAPI.getBatches();
      setBatches(response.data.batches || []);
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

  const fetchSubjects = async () => {
    try {
      const response = await timetableAPI.getTimetable(
        selectedBatch,
        selectedClass,
        selectedSection || ""
      );
      const uniqueSubjects = [
        ...new Map(
          response.data.timetable.map((item) => [
            item.subjectId._id,
            item.subjectId,
          ])
        ).values(),
      ];
      setSubjects(uniqueSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await attendanceAPI.getClassStudents({
        batchId: selectedBatch,
        classId: selectedClass,
        sectionId: selectedSection,
      });
      setStudents(response.data.students || []);
      // Initialize attendance state
      const initialAttendance = {};
      response.data.students.forEach((student) => {
        initialAttendance[student._id] = "absent";
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const loadExistingAttendance = async () => {
    try {
      if (!selectedPeriod) return;
      const response = await attendanceAPI.getClassAttendance({
        batchId: selectedBatch,
        classId: selectedClass,
        sectionId: selectedSection,
        date: attendanceDate,
        period: selectedPeriod,
      });

      const attendanceMap = {};
      response.data.attendance.forEach((record) => {
        attendanceMap[record.studentId._id] = record.status;
      });

      setAttendance(attendanceMap);
    } catch (error) {
      console.error("Error loading existing attendance:", error);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach((student) => {
      updated[student._id] = status;
    });
    setAttendance(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBatch || !selectedClass || !selectedSection || !selectedSubject || !selectedPeriod) {
      setMessage("Please select all required fields");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const attendanceData = students.map((student) => ({
        studentId: student._id,
        status: attendance[student._id] || "absent",
      }));

      const response = await attendanceAPI.markAttendance({
        batchId: selectedBatch,
        classId: selectedClass,
        sectionId: selectedSection,
        subjectId: selectedSubject,
        teacherId: teacherId,
        date: attendanceDate,
        period: parseInt(selectedPeriod),
        attendance: attendanceData,
      });

      setMessage(`Attendance marked successfully for ${response.data.count} students`);
      setMessageType("success");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error marking attendance");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceStats = () => {
    const present = Object.values(attendance).filter((s) => s === "present").length;
    const absent = Object.values(attendance).filter((s) => s === "absent").length;
    const leave = Object.values(attendance).filter((s) => s === "leave").length;

    return { present, absent, leave };
  };

  const stats = getAttendanceStats();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Mark Attendance</h1>
      <p className="text-gray-600 mb-8">Record student attendance by period and subject</p>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            messageType === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {messageType === "error" ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <Check className="w-5 h-5" />
          )}
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Filters on left */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Section</option>
                {sections.map((section, idx) => (
                  <option key={idx} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Period</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((period) => (
                  <option key={period} value={period}>
                    Period {period}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Statistics and marking area */}
        <div className="lg:col-span-3">
          {students.length > 0 ? (
            <>
              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-green-500">
                  <p className="text-gray-600 text-sm">Present</p>
                  <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-red-500">
                  <p className="text-gray-600 text-sm">Absent</p>
                  <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-yellow-500">
                  <p className="text-gray-600 text-sm">Leave</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.leave}</p>
                </div>
              </div>

              {/* Quick mark buttons */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <p className="text-gray-700 font-medium mb-3">Quick Actions</p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleMarkAll("present")}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition"
                  >
                    <Check className="w-4 h-4 inline mr-2" />
                    Mark All Present
                  </button>
                  <button
                    onClick={() => handleMarkAll("absent")}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition"
                  >
                    <X className="w-4 h-4 inline mr-2" />
                    Mark All Absent
                  </button>
                  <button
                    onClick={() => handleMarkAll("leave")}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-medium transition"
                  >
                    Mark All Leave
                  </button>
                </div>
              </div>

              {/* Student list */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Students ({students.length})
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {students.map((student) => (
                    <div
                      key={student._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {student.userId.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {student.registrationNumber}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAttendanceChange(student._id, "present")}
                          className={`px-4 py-1 rounded-lg font-medium transition ${
                            attendance[student._id] === "present"
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          <Check className="w-4 h-4 inline mr-1" />
                          Present
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student._id, "absent")}
                          className={`px-4 py-1 rounded-lg font-medium transition ${
                            attendance[student._id] === "absent"
                              ? "bg-red-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          <X className="w-4 h-4 inline mr-1" />
                          Absent
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student._id, "leave")}
                          className={`px-4 py-1 rounded-lg font-medium transition ${
                            attendance[student._id] === "leave"
                              ? "bg-yellow-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          Leave
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition"
                >
                  {loading ? "Saving..." : "Submit Attendance"}
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Select batch, class, section, and subject to mark attendance
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
