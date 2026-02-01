import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../utils/api";
import { timetableAPI, subjectAPI } from "../../utils/api";
import { Users, AlertCircle } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

export default function TeacherAllocation() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [formData, setFormData] = useState({
    batchId: "",
    classId: "",
    sectionId: "",
    subjectId: "",
    teacherId: "",
    startDate: "",
    endDate: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [batchClasses, setBatchClasses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const PREDEFINED_CLASSES = [
    { _id: "nursery", name: "Nursery" },
    { _id: "lkg", name: "LKG" },
    { _id: "ukg", name: "UKG" },
    { _id: "class1", name: "Class 1" },
    { _id: "class2", name: "Class 2" },
    { _id: "class3", name: "Class 3" },
    { _id: "class4", name: "Class 4" },
    { _id: "class5", name: "Class 5" },
    { _id: "class6", name: "Class 6" },
    { _id: "class7", name: "Class 7" },
    { _id: "class8", name: "Class 8" },
    { _id: "class9", name: "Class 9" },
    { _id: "class10", name: "Class 10" },
  ];

  const [availableSections, setAvailableSections] = useState([]);

  useEffect(() => {
    fetchBatches();
    fetchTeachers();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await adminAPI.getBatches();
      setBatches(response.data);
    } catch (err) {
      console.error("Error fetching batches:", err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await adminAPI.getAllTeachers();
      setTeachers(response.data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      batchId,
      classId: "",
      sectionId: "",
    }));
    setAvailableSections([]);

    // Get classes for this batch
    const selectedBatch = batches.find((b) => b._id === batchId);
    if (selectedBatch && selectedBatch.classes) {
      const classIds = selectedBatch.classes.map((c) => c.classId);
      const classes = PREDEFINED_CLASSES.filter((c) => classIds.includes(c._id));
      setBatchClasses(classes);
    }
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      classId,
      sectionId: "",
    }));

    // Calculate available sections based on batch/class
    const selectedBatch = batches.find((b) => b._id === formData.batchId);
    if (selectedBatch && selectedBatch.classes) {
      const classInfo = selectedBatch.classes.find((c) => c.classId === classId);
      if (classInfo) {
        const sections = Array.from(
          { length: classInfo.numberOfSections },
          (_, i) => String.fromCharCode(65 + i)
        );
        setAvailableSections(sections);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Load subjects when section changes
    if (name === "sectionId" && formData.batchId && formData.classId && value) {
      loadSubjectsAndAllocations();
    }
  };

  const loadSubjectsAndAllocations = async () => {
    try {
      if (formData.batchId && formData.classId) {
        // Get subjects allocated to this class
        const subjectsResponse = await subjectAPI.getSubjectsForClass(
          formData.batchId,
          formData.classId
        );
        setSubjects(subjectsResponse.data);

        // Load existing teacher allocations for this section
        const allocationsResponse = await timetableAPI.getTeacherAllocations(
          formData.batchId,
          formData.classId,
          formData.sectionId || "A"
        );
        setAllocations(allocationsResponse.data);
      }
    } catch (err) {
      console.error("Error loading subjects:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (
        !formData.batchId ||
        !formData.classId ||
        !formData.sectionId ||
        !formData.subjectId ||
        !formData.teacherId
      ) {
        setError("Please fill all required fields");
        setLoading(false);
        return;
      }

      await timetableAPI.allocateTeacher({
        batchId: formData.batchId,
        classId: formData.classId,
        sectionId: formData.sectionId,
        subjectId: formData.subjectId,
        teacherId: formData.teacherId,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });

      setSuccess(true);
      setFormData({
        ...formData,
        subjectId: "",
        teacherId: "",
      });

      // Reload allocations
      if (formData.batchId && formData.classId && formData.sectionId) {
        loadSubjectsAndAllocations();
      }

      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error allocating teacher");
    } finally {
      setLoading(false);
    }
  };

  const getTeacherName = (teacher) => {
    if (typeof teacher.userId === "object") {
      return teacher.userId?.name || teacher.employeeId;
    }
    return teacher.employeeId;
  };

  // Get available teachers - exclude already allocated ones for this section
  const getAvailableTeachers = () => {
    const allocatedTeacherIds = allocations.map((a) => a.teacherId._id);
    return teachers.filter((teacher) => !allocatedTeacherIds.includes(teacher._id));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Users size={32} />
                Teacher Subject Allocation
              </h1>
              <p className="text-gray-600 mt-2">
                Assign teachers to subjects for batch/class/section
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Allocate Teacher</h2>

                {success && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                    ✓ Teacher allocated successfully!
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Batch *
                    </label>
                    <select
                      name="batchId"
                      value={formData.batchId}
                      onChange={handleBatchChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      required
                    >
                      <option value="">Select batch</option>
                      {batches.map((batch) => (
                        <option key={batch._id} value={batch._id}>
                          {batch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class *
                    </label>
                    <select
                      name="classId"
                      value={formData.classId}
                      onChange={handleClassChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      required
                      disabled={!formData.batchId}
                    >
                      <option value="">Select class</option>
                      {batchClasses.map((cls) => (
                        <option key={cls._id} value={cls._id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section *
                    </label>
                    <select
                      name="sectionId"
                      value={formData.sectionId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      required
                      disabled={!formData.classId || availableSections.length === 0}
                    >
                      <option value="">{availableSections.length === 0 ? "No sections" : "Select section"}</option>
                      {availableSections.map((section) => (
                        <option key={section} value={section}>
                          Section {section}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <select
                      name="subjectId"
                      value={formData.subjectId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      required
                    >
                      <option value="">Select subject</option>
                      {subjects.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teacher *
                    </label>
                    <select
                      name="teacherId"
                      value={formData.teacherId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      required
                      disabled={allocations.length > 0 && getAvailableTeachers().length === 0}
                    >
                      <option value="">
                        {allocations.length > 0 && getAvailableTeachers().length === 0
                          ? "All teachers allocated"
                          : "Select teacher"}
                      </option>
                      {getAvailableTeachers().map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                          {getTeacherName(teacher)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {loading ? "Allocating..." : "Allocate Teacher"}
                  </button>
                </form>
              </div>

              {/* Allocations Display Section */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Current Allocations</h2>

                {allocations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-300">
                          <th className="text-left py-2 px-3 font-semibold text-gray-700">
                            Section
                          </th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-700">
                            Subject
                          </th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-700">
                            Teacher
                          </th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-700">
                            Duration
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {allocations.map((alloc, idx) => (
                          <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-2 px-3">Section {alloc.sectionId}</td>
                            <td className="py-2 px-3">{alloc.subjectId.name}</td>
                            <td className="py-2 px-3">
                              {getTeacherName(alloc.teacherId)}
                            </td>
                            <td className="py-2 px-3 text-xs text-gray-600">
                              {alloc.startDate
                                ? new Date(alloc.startDate).toLocaleDateString()
                                : "N/A"}{" "}
                              to{" "}
                              {alloc.endDate
                                ? new Date(alloc.endDate).toLocaleDateString()
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p>No allocations yet. Select batch, class, and section to view.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
