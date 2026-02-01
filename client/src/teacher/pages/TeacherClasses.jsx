import { useState, useEffect } from "react";
import TeacherSidebar from "../components/TeacherSidebar";
import TeacherTopbar from "../components/TeacherTopbar";
import { teacherAPI } from "../../utils/api";
import { AlertCircle, Users, BookOpen } from "lucide-react";

export default function TeacherClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTeacherClasses();
  }, []);

  const fetchTeacherClasses = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getClasses();
      setClasses(response.data.classes || []);
      setError("");
    } catch (error) {
      console.error("Error fetching classes:", error);
      setError(error.response?.data?.message || "Error loading classes");
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <TeacherSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TeacherTopbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading your classes...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <TeacherSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TeacherTopbar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Classes</h1>
            
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 border border-red-300 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <div key={cls._id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition p-6">
                    <div className="flex items-start justify-between mb-4">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{cls.name}</h3>
                    <div className="space-y-2 text-gray-600">
                      <p>
                        <span className="font-semibold">Batch:</span> {cls.batchId?.name || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold">Section:</span> {cls.sectionId?.name || "N/A"}
                      </p>
                      <p className="flex items-center gap-2 pt-2 border-t">
                        <Users className="w-4 h-4" />
                        <span className="font-semibold">Students:</span> {cls.students?.length || 0}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full">
                  <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No classes assigned yet</p>
                    <p className="text-gray-500 mt-2">Contact your administrator to get assigned to classes</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
