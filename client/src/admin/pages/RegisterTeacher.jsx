import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../utils/api";
import { BookOpen, AlertCircle, Users } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

export default function RegisterTeacher() {
  const navigate = useNavigate();
  const [view, setView] = useState("register"); // "register" or "view"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    qualifications: "",
  });
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch teachers on mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await adminAPI.getAllTeachers();
      setTeachers(response.data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminAPI.registerTeacher(formData);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        qualifications: "",
      });
      fetchTeachers(); // Refresh the teachers list
      setTimeout(() => {
        setSuccess(false);
        setView("view");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error registering teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Tabs */}
            <div className="mb-8 flex gap-4 border-b">
              <button
                onClick={() => setView("register")}
                className={`px-4 py-2 font-semibold transition ${
                  view === "register"
                    ? "border-b-2 border-green-500 text-green-600"
                    : "text-gray-600"
                }`}
              >
                Register New Teacher
              </button>
              <button
                onClick={() => setView("view")}
                className={`px-4 py-2 font-semibold transition ${
                  view === "view"
                    ? "border-b-2 border-green-500 text-green-600"
                    : "text-gray-600"
                }`}
              >
                View Registered Teachers
              </button>
            </div>

            {view === "register" ? (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <BookOpen size={32} />
                    Register New Teacher
                  </h1>
                  <p className="text-gray-600 mt-2">Add a new teacher to the system</p>
                </div>

                <div className="max-w-2xl bg-white rounded-lg shadow-lg p-8">
              {success && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  ✓ Teacher registered successfully! Redirecting...
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="teacher@school.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="1234567890"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualifications
                  </label>
                  <textarea
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    placeholder="B.Sc in Chemistry, M.Ed"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Registering..." : "Register Teacher"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/admin/dashboard")}
                    className="flex-1 bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <Users size={32} />
                    Registered Teachers
                  </h1>
                  <p className="text-gray-600 mt-2">View all registered teachers in the system</p>
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="bg-white rounded-lg shadow-lg p-8">
                  {teachers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-300">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee ID</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Qualifications</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Specialization</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teachers.map((teacher, idx) => {
                            const userName = typeof teacher.userId === 'object' ? teacher.userId?.name : teacher.userId;
                            const userEmail = typeof teacher.userId === 'object' ? teacher.userId?.email : '';
                            const userPhone = typeof teacher.userId === 'object' ? teacher.userId?.phone : '';
                            return (
                            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="py-3 px-4 text-gray-800">{teacher.employeeId}</td>
                              <td className="py-3 px-4 text-gray-800">{userName || "N/A"}</td>
                              <td className="py-3 px-4 text-gray-800">{userEmail || "N/A"}</td>
                              <td className="py-3 px-4 text-gray-800">{userPhone || "N/A"}</td>
                              <td className="py-3 px-4 text-gray-800">{teacher.department || "N/A"}</td>
                              <td className="py-3 px-4 text-gray-800">{teacher.qualifications || "N/A"}</td>
                              <td className="py-3 px-4 text-gray-800">{teacher.specialization || "N/A"}</td>
                            </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <p>No teachers registered yet</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
