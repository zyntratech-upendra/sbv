import { useState, useEffect } from "react";
import { attendanceAPI, studentAPI } from "../../utils/api";
import { Calendar, AlertCircle, TrendingUp } from "lucide-react";
import StudentSidebar from "../components/StudentSidebar";
import StudentTopbar from "../components/StudentTopbar";

export default function StudentAttendance() {
  const [studentId, setStudentId] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    present: 0,
    absent: 0,
    leave: 0,
    percentage: 0,
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // First, get the student ID from the API using the current user's profile
    fetchStudentInfo();
  }, []);

  const fetchStudentInfo = async () => {
    try {
      const response = await studentAPI.getProfile();
      const student = response.data.profile;
      setStudentId(student._id);
      localStorage.setItem("studentId", student._id);
      fetchAttendance(student._id);
    } catch (error) {
      console.error("Error fetching student info:", error);
      setMessage("Unable to load student information. Please log in again.");
      setLoading(false);
    }
  };

  const fetchAttendance = async (id, start = "", end = "") => {
    setLoading(true);
    setMessage("");

    try {
      const params = {};
      if (start) params.startDate = start;
      if (end) params.endDate = end;

      const response = await attendanceAPI.getStudentAttendance(id, params);

      setAttendance(response.data.attendance || []);
      setStatistics(response.data.statistics || {});
    } catch (error) {
      setMessage(error.response?.data?.message || "Error fetching attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = () => {
    if (!startDate || !endDate) {
      setMessage("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setMessage("Start date must be before end date");
      return;
    }

    fetchAttendance(studentId, startDate, endDate);
  };

  const handleResetFilter = () => {
    setStartDate("");
    setEndDate("");
    fetchAttendance(studentId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-700 border-green-300";
      case "absent":
        return "bg-red-100 text-red-700 border-red-300";
      case "leave":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return "✓";
      case "absent":
        return "✗";
      case "leave":
        return "•";
      default:
        return "-";
    }
  };

  const groupedByDate = {};
  attendance.forEach((record) => {
    const dateStr = new Date(record.date).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!groupedByDate[dateStr]) {
      groupedByDate[dateStr] = [];
    }
    groupedByDate[dateStr].push(record);
  });

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <StudentSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudentTopbar />
          <div className="text-center py-12">
            <p className="text-gray-600">Loading attendance records...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <StudentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <StudentTopbar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Attendance</h1>
            <p className="text-gray-600 mb-8">View your attendance record and statistics</p>

            {message && (
              <div className="mb-6 p-4 rounded-lg bg-yellow-100 text-yellow-700 border border-yellow-300 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {message}
              </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                <p className="text-gray-600 text-sm">Total Classes</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{statistics.total}</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                <p className="text-gray-600 text-sm">Present</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{statistics.present}</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
                <p className="text-gray-600 text-sm">Absent</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{statistics.absent}</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
                <p className="text-gray-600 text-sm">Leave</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{statistics.leave}</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
                <p className="text-gray-600 text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Attendance %
                </p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{statistics.percentage}%</p>
              </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter by Date Range</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
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

                <div className="flex gap-2">
                  <button
                    onClick={handleFilterClick}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
                  >
                    Filter
                  </button>
                  <button
                    onClick={handleResetFilter}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Attendance Records */}
            {attendance.length > 0 ? (
              <div className="space-y-6">
                {Object.entries(groupedByDate).map(([date, records]) => (
                  <div key={date} className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      {date}
                    </h3>

                    <div className="space-y-2">
                      {records.map((record, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-4 rounded-lg border-2 ${getStatusColor(
                            record.status
                          )}`}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="text-2xl font-bold">
                              {getStatusIcon(record.status)}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">
                                Period {record.period} - {record.subjectId?.name}
                              </p>
                              <p className="text-sm opacity-75">
                                Taught by: {record.teacherId?.name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold capitalize">
                              {record.status}
                            </p>
                            <p className="text-sm opacity-75">
                              {new Date(record.date).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No attendance records found for the selected period
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
