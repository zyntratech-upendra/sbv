import { useState, useEffect } from "react";
import { teacherAPI } from "../../utils/api";
import { Users, BookOpen, ClipboardList, BarChart3, UserPlus } from "lucide-react";
import TeacherSidebar from "../components/TeacherSidebar";
import TeacherTopbar from "../components/TeacherTopbar";
import AttendanceTaking from "./AttendanceTaking";
import AttendanceReport from "./AttendanceReport";

export default function TeacherDashboard() {
  const [stats, setStats] = useState({ students: 0, classes: 0 });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await teacherAPI.getStudents();
      const studentsList = response.data;
      setStudents(studentsList);
      setStats({
        students: studentsList.length,
        classes: new Set(studentsList.map((s) => s.classId?.name)).size,
      });
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <TeacherSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TeacherTopbar />
        <main className="flex-1 overflow-y-auto">
          {/* Tab Navigation */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="px-8 py-0">
              <div className="flex flex-wrap gap-0">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 py-3 font-medium border-b-2 transition whitespace-nowrap ${
                    activeTab === "overview"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("register")}
                  className={`px-4 py-3 font-medium border-b-2 transition whitespace-nowrap ${
                    activeTab === "register"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <UserPlus className="w-4 h-4 inline mr-2" />
                  Register Student
                </button>
                <button
                  onClick={() => setActiveTab("attendance")}
                  className={`px-4 py-3 font-medium border-b-2 transition whitespace-nowrap ${
                    activeTab === "attendance"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <ClipboardList className="w-4 h-4 inline mr-2" />
                  Mark Attendance
                </button>
                <button
                  onClick={() => setActiveTab("report")}
                  className={`px-4 py-3 font-medium border-b-2 transition whitespace-nowrap ${
                    activeTab === "report"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Attendance Report
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Teacher Dashboard</h1>
              <p className="text-gray-600 mb-8">Manage your classes and students</p>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm font-medium">Total Students</p>
                          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.students}</p>
                        </div>
                        <Users className="w-12 h-12 text-gray-300" />
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm font-medium">Total Classes</p>
                          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.classes}</p>
                        </div>
                        <BookOpen className="w-12 h-12 text-gray-300" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Your Students</h2>
                    {students.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Class</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Registration #</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map((student, idx) => (
                              <tr key={idx} className="border-b hover:bg-gray-50 transition">
                                <td className="px-4 py-3 text-sm text-gray-800">{student.userId?.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{student.userId?.email}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{student.classId?.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{student.registrationNumber}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No students found</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "register" && (
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Register Student</h1>
              <p className="text-gray-600 mb-8">Add new students to the system</p>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <p className="text-gray-600 text-center py-12">Student registration form will be displayed here</p>
              </div>
            </div>
          )}

          {activeTab === "attendance" && <AttendanceTaking />}

          {activeTab === "report" && <AttendanceReport />}
        </main>
      </div>
    </div>
  );
}
