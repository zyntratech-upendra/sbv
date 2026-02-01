import { useState, useEffect } from "react";
import { studentAPI, attendanceAPI } from "../../utils/api";
import { BookOpen, Calendar, Users, TrendingUp } from "lucide-react";
import StudentSidebar from "../components/StudentSidebar";
import StudentTopbar from "../components/StudentTopbar";
import StudentAttendance from "./StudentAttendance";

export default function StudentDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAttendance, setShowAttendance] = useState(false);

  useEffect(() => {
    fetchDashboard();
    fetchAttendanceSummary();
  }, []);

  const fetchAttendanceSummary = async () => {
    try {
      const response = await attendanceAPI.getStudentSummary();
      setAttendanceSummary(response.data.summary);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const fetchDashboard = async () => {
    try {
      const response = await studentAPI.getDashboard();
      setDashboard(response.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (showAttendance) {
    return <StudentAttendance />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <StudentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <StudentTopbar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Dashboard</h1>
            <p className="text-gray-600 mb-8">Welcome! Here's your academic information</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Registration Number</p>
                    <p className="text-2xl font-bold text-gray-800 mt-2">
                      {dashboard?.dashboard?.registrationNumber || "N/A"}
                    </p>
                  </div>
                  <Users className="w-12 h-12 text-gray-300" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Class</p>
                    <p className="text-2xl font-bold text-gray-800 mt-2">
                      {dashboard?.dashboard?.className || "N/A"}
                    </p>
                  </div>
                  <BookOpen className="w-12 h-12 text-gray-300" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Batch</p>
                    <p className="text-2xl font-bold text-gray-800 mt-2">
                      {dashboard?.dashboard?.batchName || "N/A"}
                    </p>
                  </div>
                  <Calendar className="w-12 h-12 text-gray-300" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Attendance</p>
                    <p className="text-2xl font-bold text-gray-800 mt-2">
                      {attendanceSummary?.percentage || "N/A"}%
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-gray-300" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Academic Information</h2>
                <div className="space-y-3">
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-gray-600">Registration:</span>
                    <span className="font-semibold text-gray-800">
                      {dashboard?.dashboard?.registrationNumber}
                    </span>
                  </div>
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-gray-600">Class:</span>
                    <span className="font-semibold text-gray-800">
                      {dashboard?.dashboard?.className}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Batch:</span>
                    <span className="font-semibold text-gray-800">
                      {dashboard?.dashboard?.batchName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Attendance Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-gray-600">Total Classes:</span>
                    <span className="font-semibold text-gray-800">
                      {attendanceSummary?.total || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-gray-600">Present:</span>
                    <span className="font-semibold text-green-600">
                      {attendanceSummary?.present || "0"}
                    </span>
                  </div>
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-gray-600">Absent:</span>
                    <span className="font-semibold text-red-600">
                      {attendanceSummary?.absent || "0"}
                    </span>
                  </div>
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-gray-600">Leave:</span>
                    <span className="font-semibold text-yellow-600">
                      {attendanceSummary?.leave || "0"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Attendance Percentage:</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {attendanceSummary?.percentage || "0"}%
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAttendance(true)}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
                  >
                    View Full Attendance Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
