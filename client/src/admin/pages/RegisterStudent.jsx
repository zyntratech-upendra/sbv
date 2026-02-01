import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../utils/api";
import { UserPlus, AlertCircle, Users } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

export default function RegisterStudent() {
  const navigate = useNavigate();
  const [view, setView] = useState("register"); // "register" or "view"
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
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Predefined classes from Nursery to 10th
  const PREDEFINED_CLASSES = [
    { _id: "nursery", name: "Nursery", classCode: "NURSERY" },
    { _id: "lkg", name: "LKG", classCode: "LKG" },
    { _id: "ukg", name: "UKG", classCode: "UKG" },
    { _id: "class1", name: "Class 1", classCode: "CLASS-1" },
    { _id: "class2", name: "Class 2", classCode: "CLASS-2" },
    { _id: "class3", name: "Class 3", classCode: "CLASS-3" },
    { _id: "class4", name: "Class 4", classCode: "CLASS-4" },
    { _id: "class5", name: "Class 5", classCode: "CLASS-5" },
    { _id: "class6", name: "Class 6", classCode: "CLASS-6" },
    { _id: "class7", name: "Class 7", classCode: "CLASS-7" },
    { _id: "class8", name: "Class 8", classCode: "CLASS-8" },
    { _id: "class9", name: "Class 9", classCode: "CLASS-9" },
    { _id: "class10", name: "Class 10", classCode: "CLASS-10" },
  ];

  // Fetch batches on mount
  useEffect(() => {
    fetchBatches();
    fetchStudents();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await adminAPI.getBatches();
      setBatches(response.data);
    } catch (err) {
      console.error("Error fetching batches:", err);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await adminAPI.getAllStudents();
      console.log("Fetched students:", response.data);
      setStudents(response.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Filter classes when batch changes
    if (name === "batchId" && value) {
      const selectedBatch = batches.find((b) => b._id === value);
      if (selectedBatch && selectedBatch.classes) {
        const batchClassIds = selectedBatch.classes.map((c) => c.classId);
        const filtered = PREDEFINED_CLASSES.filter((c) =>
          batchClassIds.includes(c._id)
        );
        setFilteredClasses(filtered);
        // Reset classId when batch changes
        setFormData((prev) => ({
          ...prev,
          classId: "",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminAPI.registerStudent(formData);
      setSuccess(true);
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
      fetchStudents(); // Refresh the students list
      setTimeout(() => {
        setSuccess(false);
        setView("view");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error registering student");
    } finally {
      setLoading(false);
    }
  };

  const getClassName = (classId) => {
    const classItem = PREDEFINED_CLASSES.find((c) => c._id === classId);
    return classItem ? classItem.name : classId;
  };

  const getBatchName = (batchId) => {
    // Handle if batchId is already populated object with name
    if (typeof batchId === 'object' && batchId?.name) {
      return batchId.name;
    }
    // Handle if batchId is a string ID
    const batch = batches.find((b) => b._id === batchId);
    return batch ? batch.name : batchId;
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
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                Register New Student
              </button>
              <button
                onClick={() => setView("view")}
                className={`px-4 py-2 font-semibold transition ${
                  view === "view"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                View Registered Students
              </button>
            </div>

            {view === "register" ? (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <UserPlus size={32} />
                    Register New Student
                  </h1>
                  <p className="text-gray-600 mt-2">Create a new student account in the system</p>
                </div>

                <div className="max-w-2xl bg-white rounded-lg shadow-lg p-8">
              {success && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  ✓ Student registered successfully! Redirecting...
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
                      placeholder="John Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                      placeholder="student@school.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Batch *
                    </label>
                    <select
                      name="batchId"
                      value={formData.batchId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    >
                      <option value="">Select a batch</option>
                      {batches.map((batch) => (
                        <option key={batch._id} value={batch._id}>
                          {batch.name} ({batch.batchCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class *
                    </label>
                    <select
                      name="classId"
                      value={formData.classId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                      disabled={!formData.batchId}
                    >
                      <option value="">
                        {!formData.batchId
                          ? "Select a batch first"
                          : "Select a class"}
                      </option>
                      {filteredClasses.map((classItem) => (
                        <option key={classItem._id} value={classItem._id}>
                          {classItem.name} ({classItem.classCode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Student address"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Guardian Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Guardian Name
                      </label>
                      <input
                        type="text"
                        name="guardianName"
                        value={formData.guardianName}
                        onChange={handleChange}
                        placeholder="Guardian Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Guardian Phone
                      </label>
                      <input
                        type="tel"
                        name="guardianPhone"
                        value={formData.guardianPhone}
                        onChange={handleChange}
                        placeholder="Guardian Phone"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Registering..." : "Register Student"}
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
                    Registered Students
                  </h1>
                  <p className="text-gray-600 mt-2">View all registered students in the system</p>
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="bg-white rounded-lg shadow-lg p-8">
                  {students.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-300">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Registration No.</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Batch</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Class</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Guardian</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student, idx) => {
                            const userName = typeof student.userId === 'object' ? student.userId?.name : student.userId;
                            const userEmail = typeof student.userId === 'object' ? student.userId?.email : '';
                            const userPhone = typeof student.userId === 'object' ? student.userId?.phone : '';
                            return (
                            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="py-3 px-4 text-gray-800">{student.registrationNumber}</td>
                              <td className="py-3 px-4 text-gray-800">{userName || "N/A"}</td>
                              <td className="py-3 px-4 text-gray-800">{userEmail || "N/A"}</td>
                              <td className="py-3 px-4 text-gray-800">{userPhone || "N/A"}</td>
                              <td className="py-3 px-4 text-gray-800">{getBatchName(student.batchId)}</td>
                              <td className="py-3 px-4 text-gray-800">{getClassName(student.classId)}</td>
                              <td className="py-3 px-4 text-gray-800">{student.guardianName || "N/A"}</td>
                            </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <p>No students registered yet</p>
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
