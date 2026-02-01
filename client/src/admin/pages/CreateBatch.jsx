import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../utils/api";
import { Calendar, AlertCircle, Plus, Trash2, Edit2 } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

export default function CreateBatch() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    batchCode: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [classes, setClasses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(null);
  const [view, setView] = useState("create"); // "create", "list", "edit"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newClassItem, setNewClassItem] = useState({
    classId: "",
    numberOfSections: 1,
    capacity: 50,
  });

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

  // Generate year options (current year + 5 years)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = -1; i <= 5; i++) {
      const year = currentYear + i;
      years.push({
        value: year,
        label: `${year}-${year + 1}`,
      });
    }
    return years;
  };

  const YEAR_OPTIONS = generateYearOptions();

  // Fetch batches on mount
  useEffect(() => {
    fetchBatches();
  }, []);

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

  const handleYearChange = (selectedYear) => {
    const year = parseInt(selectedYear);
    const startDate = new Date(year, 3, 1); // April 1st
    const endDate = new Date(year + 1, 2, 31); // March 31st next year
    const batchCode = `BATCH-${year}`;

    setFormData((prev) => ({
      ...prev,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      name: `${year}-${year + 1}`,
      batchCode: batchCode,
    }));
  };

  const handleAddClass = () => {
    if (!newClassItem.classId) {
      setError("Please select a class");
      return;
    }
    if (classes.find((c) => c.classId === newClassItem.classId)) {
      setError("This class is already added");
      return;
    }
    setClasses([...classes, { ...newClassItem }]);
    setNewClassItem({ classId: "", numberOfSections: 1 });
    setError("");
  };

  const handleRemoveClass = (classId) => {
    setClasses(classes.filter((c) => c.classId !== classId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (classes.length === 0) {
        setError("Please add at least one class");
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        classes,
      };

      if (view === "edit" && currentBatch) {
        await adminAPI.updateBatch(currentBatch._id, payload);
      } else {
        await adminAPI.createBatch(payload);
      }

      setSuccess(true);
      setFormData({
        name: "",
        batchCode: "",
        description: "",
        startDate: "",
        endDate: "",
      });
      setClasses([]);
      setTimeout(() => {
        setView("list");
        fetchBatches();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating/updating batch");
    } finally {
      setLoading(false);
    }
  };

  const handleEditBatch = (batch) => {
    setCurrentBatch(batch);
    setFormData({
      name: batch.name,
      batchCode: batch.batchCode,
      description: batch.description,
      startDate: batch.startDate ? batch.startDate.split("T")[0] : "",
      endDate: batch.endDate ? batch.endDate.split("T")[0] : "",
    });
    setClasses(batch.classes || []);
    setView("edit");
  };

  const handleDeleteBatch = async (batchId) => {
    if (!window.confirm("Are you sure you want to delete this batch?")) return;

    try {
      await adminAPI.deleteBatch(batchId);
      fetchBatches();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting batch");
    }
  };

  const getClassName = (classId) => {
    const classItem = PREDEFINED_CLASSES.find((c) => c._id === classId);
    return classItem ? classItem.name : classId;
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
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                Create New Batch
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-4 py-2 font-semibold transition ${
                  view === "list"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                View & Manage Batches
              </button>
            </div>

            {/* Create/Edit View */}
            {view === "create" || view === "edit" ? (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar size={32} />
                    {view === "create" ? "Create New Batch" : "Edit Batch"}
                  </h1>
                  <p className="text-gray-600 mt-2">
                    {view === "create"
                      ? "Set up a new batch for the academic year"
                      : "Update batch information"}
                  </p>
                </div>

                <div className="max-w-4xl bg-white rounded-lg shadow-lg p-8">
                  {success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                      ✓ {view === "create" ? "Batch created" : "Batch updated"}{" "}
                      successfully!
                    </div>
                  )}

                  {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Batch Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Academic Year *
                        </label>
                        <select
                          onChange={(e) => handleYearChange(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                        >
                          <option value="">Select Academic Year</option>
                          {YEAR_OPTIONS.map((year) => (
                            <option key={year.value} value={year.value}>
                              {year.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Batch Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="2024-2025"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Date *
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
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
                        placeholder="Batch description"
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                      />
                    </div>

                    {/* Classes and Sections */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Classes & Sections
                      </h3>

                      {/* Add Class Section */}
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Select Class *
                            </label>
                            <select
                              value={newClassItem.classId}
                              onChange={(e) =>
                                setNewClassItem({
                                  ...newClassItem,
                                  classId: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                              <option value="">Choose a class</option>
                              {PREDEFINED_CLASSES.map((cls) => (
                                <option key={cls._id} value={cls._id}>
                                  {cls.name} ({cls.classCode})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Sections *
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={newClassItem.numberOfSections}
                              onChange={(e) =>
                                setNewClassItem({
                                  ...newClassItem,
                                  numberOfSections: parseInt(e.target.value),
                                })
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Capacity/Section *
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={newClassItem.capacity}
                              onChange={(e) =>
                                setNewClassItem({
                                  ...newClassItem,
                                  capacity: parseInt(e.target.value),
                                })
                              }
                              placeholder="50"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>

                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={handleAddClass}
                              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                            >
                              <Plus size={18} />
                              Add
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Classes List */}
                      {classes.length > 0 ? (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-700 mb-2">
                            Added Classes:
                          </h4>
                          {classes.map((classItem, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                            >
                              <div>
                                <p className="font-medium text-gray-800">
                                  {getClassName(classItem.classId)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Sections: {classItem.numberOfSections}
                                  {" "}
                                  {Array.from(
                                    { length: classItem.numberOfSections },
                                    (_, i) => String.fromCharCode(65 + i)
                                  ).join(", ")}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Capacity/Section: {classItem.capacity}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveClass(classItem.classId)
                                }
                                className="text-red-500 hover:text-red-700 transition"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">
                          No classes added yet
                        </p>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading
                          ? "Processing..."
                          : view === "create"
                          ? "Create Batch"
                          : "Update Batch"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setView("list");
                          setFormData({
                            name: "",
                            batchCode: "",
                            description: "",
                            startDate: "",
                            endDate: "",
                          });
                          setClasses([]);
                          setCurrentBatch(null);
                        }}
                        className="flex-1 bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              /* List View */
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar size={32} />
                    Manage Batches
                  </h1>
                  <p className="text-gray-600 mt-2">View, edit, or delete batches</p>
                </div>

                {success && (
                  <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    ✓ Operation completed successfully!
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid gap-4">
                  {batches.length > 0 ? (
                    batches.map((batch) => (
                      <div
                        key={batch._id}
                        className="bg-white rounded-lg shadow p-6 border-l-4 border-pink-500"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              {batch.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Code: {batch.batchCode}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditBatch(batch)}
                              className="text-blue-500 hover:text-blue-700 transition"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteBatch(batch._id)}
                              className="text-red-500 hover:text-red-700 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-gray-600">Start Date</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(batch.startDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">End Date</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(batch.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total Strength</p>
                            <p className="font-semibold text-gray-800">
                              {batch.strength}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Classes</p>
                            <p className="font-semibold text-gray-800">
                              {batch.classes?.length || 0}
                            </p>
                          </div>
                        </div>

                        {batch.classes && batch.classes.length > 0 && (
                          <div className="border-t pt-4">
                            <p className="font-semibold text-gray-700 mb-2">
                              Classes:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {batch.classes.map((classItem, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                >
                                  {classItem.classId?.name || classItem.classId} (
                                  {classItem.numberOfSections} sections)
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
                      <p>No batches found. Create one to get started!</p>
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