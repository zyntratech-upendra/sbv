import { useState, useEffect } from "react";
import TeacherSidebar from "../components/TeacherSidebar";
import TeacherTopbar from "../components/TeacherTopbar";
import { studentAPI, commonAPI, teacherAPI } from "../../utils/api";
import { AlertCircle, Check, UserPlus, Users } from "lucide-react";

export default function TeacherRegisterStudent() {
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
  const [allClasses, setAllClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Fetch batches and students on mount
  useEffect(() => {
    fetchBatchesAndStudents();
  }, []);

  const fetchBatchesAndStudents = async () => {
    try {
      setPageLoading(true);
      const batchResponse = await commonAPI.getBatches();
      setBatches(batchResponse.data || []);
      
      // Fetch all classes from the system
      const classesResponse = await commonAPI.getClasses();
      setAllClasses(classesResponse.data || []);
      
      // Fetch students from teacher API
      const studentsResponse = await teacherAPI.getStudents();
      setStudents(studentsResponse.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error loading data");
    } finally {
      setPageLoading(false);
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
      // Filter classes that belong to the selected batch
      const batchClasses = allClasses.filter((cls) => cls.batchId === value);
      setFilteredClasses(batchClasses);
      // Reset classId when batch changes
      setFormData((prev) => ({
        ...prev,
        classId: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await studentAPI.register(formData);
      setSuccess(true);
      setMessage("Student registered successfully!");
      setMessageType("success");
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
      fetchBatchesAndStudents(); // Refresh the students list
      setTimeout(() => {
        setSuccess(false);
        setMessage("");
        setView("view");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error registering student");
      setMessage(err.response?.data?.message || "Error registering student");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const getClassName = (classId) => {
    // Handle if classId is already populated object with name
    if (typeof classId === 'object' && classId?.name) {
      return classId.name;
    }
    // Handle if classId is a string ID
    const classItem = allClasses.find((c) => c._id === classId);
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

  if (pageLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <TeacherSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TeacherTopbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading data...</p>
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
                Register New Student
              </button>
              <button
                onClick={() => setView("view")}
                className={`px-4 py-2 font-semibold transition ${
                  view === "view"
                    ? "border-b-2 border-green-500 text-green-600"
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
                      placeholder="student@school.com"
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      required
                      disabled={!formData.batchId}
                    >
                      <option value="">
                        {!formData.batchId
                          ? "Select a batch first"
                          : filteredClasses.length === 0
                          ? "No classes available for this batch"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Registering..." : "Register Student"}
                </button>
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
                  <p className="text-gray-600 mt-2">View all students registered by you</p>
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
