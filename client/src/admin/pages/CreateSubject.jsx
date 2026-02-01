import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { subjectAPI } from "../../utils/api";
import { adminAPI } from "../../utils/api";
import { Plus, Trash2, Edit2, AlertCircle, BookOpen } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

export default function CreateSubject() {
  const navigate = useNavigate();
  const [view, setView] = useState("create"); // "create", "list", "allocate"
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [batches, setBatches] = useState([]);
  const [allocationData, setAllocationData] = useState({
    batchId: "",
    classId: "",
    selectedSubjects: [],
  });
  const [allAllocations, setAllAllocations] = useState([]);
  const [batchClassesForAllocation, setBatchClassesForAllocation] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  // Fetch data on mount
  useEffect(() => {
    fetchSubjects();
    fetchBatches();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await subjectAPI.getAll();
      setSubjects(response.data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await adminAPI.getBatches();
      setBatches(response.data);
    } catch (err) {
      console.error("Error fetching batches:", err);
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
      await subjectAPI.create(formData);
      setSuccess(true);
      setFormData({
        name: "",
        code: "",
        description: "",
      });
      fetchSubjects();
      setTimeout(() => {
        setSuccess(false);
        setView("list");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating subject");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    try {
      await subjectAPI.delete(id);
      fetchSubjects();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting subject");
    }
  };

  const handleSubjectToggle = (subjectId) => {
    setAllocationData((prev) => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(subjectId)
        ? prev.selectedSubjects.filter((id) => id !== subjectId)
        : [...prev.selectedSubjects, subjectId],
    }));
  };

  const handleBatchChangeForAllocation = (e) => {
    const batchId = e.target.value;
    setAllocationData((prev) => ({
      ...prev,
      batchId,
      classId: "",
    }));

    // Get classes for this batch
    const selectedBatch = batches.find((b) => b._id === batchId);
    if (selectedBatch && selectedBatch.classes) {
      const classIds = selectedBatch.classes.map((c) => c.classId);
      const classes = PREDEFINED_CLASSES.filter((c) => classIds.includes(c._id));
      setBatchClassesForAllocation(classes);
    } else {
      setBatchClassesForAllocation([]);
    }
  };

  const handleAllocateSubjects = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!allocationData.batchId || !allocationData.classId || allocationData.selectedSubjects.length === 0) {
        setError("Please select batch, class, and at least one subject");
        setLoading(false);
        return;
      }

      await subjectAPI.allocate({
        batchId: allocationData.batchId,
        classId: allocationData.classId,
        subjectIds: allocationData.selectedSubjects,
      });

      setSuccess(true);
      setAllocationData({
        batchId: "",
        classId: "",
        selectedSubjects: [],
      });
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error allocating subjects");
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
                onClick={() => setView("create")}
                className={`px-4 py-2 font-semibold transition ${
                  view === "create"
                    ? "border-b-2 border-purple-500 text-purple-600"
                    : "text-gray-600"
                }`}
              >
                Create Subject
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-4 py-2 font-semibold transition ${
                  view === "list"
                    ? "border-b-2 border-purple-500 text-purple-600"
                    : "text-gray-600"
                }`}
              >
                View Subjects
              </button>
              <button
                onClick={() => setView("allocate")}
                className={`px-4 py-2 font-semibold transition ${
                  view === "allocate"
                    ? "border-b-2 border-purple-500 text-purple-600"
                    : "text-gray-600"
                }`}
              >
                Allocate to Classes
              </button>
            </div>

            {view === "create" ? (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <BookOpen size={32} />
                    Create Subject
                  </h1>
                  <p className="text-gray-600 mt-2">Add a new subject to the system</p>
                </div>

                <div className="max-w-2xl bg-white rounded-lg shadow-lg p-8">
                  {success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                      ✓ Subject created successfully!
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
                          Subject Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Mathematics"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject Code *
                        </label>
                        <input
                          type="text"
                          name="code"
                          value={formData.code}
                          onChange={handleChange}
                          placeholder="MATH"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Subject description"
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Creating..." : "Create Subject"}
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
            ) : view === "list" ? (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <BookOpen size={32} />
                    All Subjects
                  </h1>
                  <p className="text-gray-600 mt-2">View and manage subjects</p>
                </div>

                {success && (
                  <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    ✓ Operation successful!
                  </div>
                )}

                <div className="grid gap-4">
                  {subjects.length > 0 ? (
                    subjects.map((subject) => (
                      <div
                        key={subject._id}
                        className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              {subject.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Code: {subject.code}
                            </p>
                            {subject.description && (
                              <p className="text-sm text-gray-600 mt-2">
                                {subject.description}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteSubject(subject._id)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
                      <p>No subjects found</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <BookOpen size={32} />
                    Allocate Subjects to Classes
                  </h1>
                  <p className="text-gray-600 mt-2">Assign subjects to specific classes in a batch</p>
                </div>

                <div className="max-w-4xl bg-white rounded-lg shadow-lg p-8">
                  {success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                      ✓ Subjects allocated successfully!
                    </div>
                  )}

                  {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleAllocateSubjects} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Batch *
                        </label>
                        <select
                          value={allocationData.batchId}
                          onChange={handleBatchChangeForAllocation}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                          required
                        >
                          <option value="">Choose a batch</option>
                          {batches.map((batch) => (
                            <option key={batch._id} value={batch._id}>
                              {batch.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Class *
                        </label>
                        <select
                          value={allocationData.classId}
                          onChange={(e) =>
                            setAllocationData((prev) => ({
                              ...prev,
                              classId: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                          required
                          disabled={!allocationData.batchId}
                        >
                          <option value="">Choose a class</option>
                          {batchClassesForAllocation.map((cls) => (
                            <option key={cls._id} value={cls._id}>
                              {cls.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Select Subjects *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {subjects.map((subject) => (
                          <label key={subject._id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={allocationData.selectedSubjects.includes(subject._id)}
                              onChange={() => handleSubjectToggle(subject._id)}
                              className="w-4 h-4 rounded"
                            />
                            <div>
                              <p className="font-medium text-gray-800">{subject.name}</p>
                              <p className="text-sm text-gray-600">{subject.code}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Allocating..." : "Allocate Subjects"}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
