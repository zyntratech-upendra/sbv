import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../utils/api";
import { timetableAPI, subjectAPI } from "../../utils/api";
import { Calendar, AlertCircle, Plus, Trash2 } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

export default function Timetable() {
  const navigate = useNavigate();
  const [view, setView] = useState("create"); // "create", "view", "viewAll", "allocations"
  const [batches, setBatches] = useState([]);
  const [batchClasses, setBatchClasses] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [allAllocations, setAllAllocations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [timetableEntries, setTimetableEntries] = useState([]);
  const [allTimetables, setAllTimetables] = useState([]);
  
  const [formData, setFormData] = useState({
    batchId: "",
    classId: "",
    sectionId: "",
    day: "Monday",
    period: 1,
    startTime: "09:00",
    endTime: "10:00",
    subjectId: "",
    teacherId: "",
  });

  const [filterData, setFilterData] = useState({
    batchId: "",
    classId: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [availableSections, setAvailableSections] = useState([]);

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

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const PERIODS = Array.from({ length: 8 }, (_, i) => i + 1);

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
    console.log(name,value)
    // Update form data immediately
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);

    // Load allocations when section changes
    if (name === "sectionId" && value && updatedFormData.batchId && updatedFormData.classId) {
      loadAllocations(updatedFormData.batchId, updatedFormData.classId, value);
    }

    // Auto-fill subject when teacher is selected
    if (name === "teacherId" && value && allocations.length > 0) {
      const teacherAllocation = allocations.find((a) => a.teacherId._id === value);
      if (teacherAllocation) {
        setFormData((prev) => ({
          ...prev,
          subjectId: teacherAllocation.subjectId._id,
        }));
      }
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

  const loadAllocations = async (batchId, classId, sectionId) => {
    console.log("Loading allocations for:", batchId, classId, sectionId);
    try {
      // Subjects and allocations are fetched based on batch and class only
      if (batchId && classId) {
        // Get subjects allocated to this class (based on batch and class)
        const subjectsResponse = await subjectAPI.getSubjectsForClass(
          batchId,
          classId
        );
        console.log("Subjects:", subjectsResponse.data);
        setSubjects(subjectsResponse.data);

        // Get teacher allocations for this class (based on batch and class)
        const allocationsResponse = await timetableAPI.getTeacherAllocations(
          batchId,
          classId,
          sectionId
        );
        console.log("Allocations:", allocationsResponse.data);
        setAllocations(allocationsResponse.data);
        
        // Load timetable for the selected section
        if (sectionId) {
          loadTimetable(batchId, classId, sectionId);
        }
      }
    } catch (err) {
      console.error("Error loading allocations:", err);
    }
  };

  const loadTimetable = async (batchId, classId, sectionId) => {
    try {
      const batch = batchId || formData.batchId;
      const cls = classId || formData.classId;
      const section = sectionId || formData.sectionId;
      
      if (batch && cls && section) {
        const response = await timetableAPI.getTimetable(
          batch,
          cls,
          section
        );
        setTimetableEntries(response.data);
      }
    } catch (err) {
      console.error("Error loading timetable:", err);
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

      await timetableAPI.createEntry({
        batchId: formData.batchId,
        classId: formData.classId,
        sectionId: formData.sectionId,
        day: formData.day,
        period: parseInt(formData.period),
        startTime: formData.startTime,
        endTime: formData.endTime,
        subjectId: formData.subjectId,
        teacherId: formData.teacherId,
      });

      setSuccess(true);
      loadTimetable();
      setFormData((prev) => ({
        ...prev,
        period: parseInt(prev.period) + 1,
        subjectId: "",
        teacherId: "",
      }));

      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating timetable entry");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;

    try {
      await timetableAPI.deleteEntry(id);
      loadTimetable();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError("Error deleting entry");
    }
  };

  const loadAllTimetables = async () => {
    try {
      setLoading(true);
      if (!filterData.batchId || !filterData.classId) {
        setError("Please select batch and class");
        return;
      }

      // Get all sections for the selected batch and class
      const selectedBatch = batches.find((b) => b._id === filterData.batchId);
      const classInfo = selectedBatch?.classes?.find((c) => c.classId === filterData.classId);
      
      if (!classInfo) {
        setError("Class not found");
        return;
      }

      const sections = Array.from(
        { length: classInfo.numberOfSections },
        (_, i) => String.fromCharCode(65 + i)
      );

      // Fetch timetables for all sections
      const allTimetablesData = [];
      for (const section of sections) {
        try {
          const response = await timetableAPI.getTimetable(
            filterData.batchId,
            filterData.classId,
            section
          );
          allTimetablesData.push({
            section,
            entries: response.data,
          });
        } catch (err) {
          console.error(`Error loading timetable for section ${section}:`, err);
        }
      }

      setAllTimetables(allTimetablesData);
      setError("");
    } catch (err) {
      console.error("Error loading all timetables:", err);
      setError("Error loading timetables");
    } finally {
      setLoading(false);
    }
  };

  const loadAllAllocations = async () => {
    try {
      setLoading(true);
      if (!filterData.batchId || !filterData.classId) {
        setError("Please select batch and class");
        return;
      }

      // Get all sections for the selected batch and class
      const selectedBatch = batches.find((b) => b._id === filterData.batchId);
      const classInfo = selectedBatch?.classes?.find((c) => c.classId === filterData.classId);
      
      if (!classInfo) {
        setError("Class not found");
        return;
      }

      const sections = Array.from(
        { length: classInfo.numberOfSections },
        (_, i) => String.fromCharCode(65 + i)
      );

      // Fetch allocations for all sections
      const allAllocationsData = [];
      for (const section of sections) {
        try {
          const response = await timetableAPI.getTeacherAllocations(
            filterData.batchId,
            filterData.classId,
            section
          );
          allAllocationsData.push({
            section,
            allocations: response.data,
          });
        } catch (err) {
          console.error(`Error loading allocations for section ${section}:`, err);
        }
      }

      setAllAllocations(allAllocationsData);
      setError("");
    } catch (err) {
      console.error("Error loading all allocations:", err);
      setError("Error loading allocations");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update batchClasses when batch changes
    if (name === "batchId") {
      const selectedBatch = batches.find((b) => b._id === value);
      if (selectedBatch && selectedBatch.classes) {
        const classIds = selectedBatch.classes.map((c) => c.classId);
        const classes = PREDEFINED_CLASSES.filter((c) => classIds.includes(c._id));
        setBatchClasses(classes);
      }
    }
  };

  const getTeacherName = (teacher) => {
    if (typeof teacher.userId === "object") {
      return teacher.userId?.name || teacher.employeeId;
    }
    return teacher.employeeId;
  };

  const groupedTimetable = DAYS.reduce((acc, day) => {
    acc[day] = timetableEntries.filter((entry) => entry.day === day);
    return acc;
  }, {});

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
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-600"
                }`}
              >
                Create Timetable
              </button>
              <button
                onClick={() => setView("view")}
                className={`px-4 py-2 font-semibold transition ${
                  view === "view"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-600"
                }`}
              >
                View Timetable
              </button>
              <button
                onClick={() => setView("viewAll")}
                className={`px-4 py-2 font-semibold transition ${
                  view === "viewAll"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-600"
                }`}
              >
                View All Timetables
              </button>
              <button
                onClick={() => setView("allocations")}
                className={`px-4 py-2 font-semibold transition ${
                  view === "allocations"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-600"
                }`}
              >
                Teacher Allocations
              </button>
            </div>

            {view === "create" ? (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar size={32} />
                    Create Timetable
                  </h1>
                  <p className="text-gray-600 mt-2">Add periods and assign subjects/teachers to each slot</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Form Section */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-lg p-8 h-fit">
                      <h2 className="text-lg font-bold text-gray-800 mb-6">Add Period</h2>

                      {success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                          ✓ Added successfully!
                        </div>
                      )}

                      {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Batch *
                          </label>
                          <select
                            value={formData.batchId}
                            onChange={handleBatchChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                          >
                            <option value="">Select</option>
                            {batches.map((batch) => (
                              <option key={batch._id} value={batch._id}>
                                {batch.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Class *
                          </label>
                          <select
                            value={formData.classId}
                            onChange={handleClassChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                            disabled={!formData.batchId}
                          >
                            <option value="">Select</option>
                            {batchClasses.map((cls) => (
                              <option key={cls._id} value={cls._id}>
                                {cls.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Section *
                          </label>
                          <select
                            name="sectionId"
                            value={formData.sectionId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                            disabled={!formData.classId || availableSections.length === 0}
                          >
                            <option value="">{availableSections.length === 0 ? "No sections" : "Select"}</option>
                            {availableSections.map((sec) => (
                              <option key={sec} value={sec}>
                                Section {sec}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Day *</label>
                          <select
                            name="day"
                            value={formData.day}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          >
                            {DAYS.map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Period *
                          </label>
                          <select
                            name="period"
                            value={formData.period}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          >
                            {PERIODS.map((p) => (
                              <option key={p} value={p}>
                                Period {p}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Start Time
                            </label>
                            <input
                              type="time"
                              name="startTime"
                              value={formData.startTime}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              End Time
                            </label>
                            <input
                              type="time"
                              name="endTime"
                              value={formData.endTime}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject *
                          </label>
                          <select
                            name="subjectId"
                            value={formData.subjectId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                            disabled={!formData.sectionId || subjects.length === 0}
                          >
                            <option value="">{subjects.length === 0 ? "No subjects" : "Select"}</option>
                            {subjects.map((subject) => (
                              <option key={subject._id} value={subject._id}>
                                {subject.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Teacher *
                          </label>
                          <select
                            name="teacherId"
                            value={formData.teacherId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                            disabled={!formData.sectionId || allocations.length === 0}
                          >
                            <option value="">{allocations.length === 0 ? "No teachers" : "Select"}</option>
                            {allocations.map((alloc) => (
                              <option key={alloc.teacherId._id} value={alloc.teacherId._id}>
                                {getTeacherName(alloc.teacherId)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 mt-6"
                        >
                          {loading ? "Adding..." : "Add Period"}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Timetable View */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                      <h2 className="text-lg font-bold text-gray-800 mb-6">
                        Timetable - {PREDEFINED_CLASSES.find((c) => c._id === formData.classId)?.name} Section{" "}
                        {formData.sectionId}
                      </h2>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="bg-indigo-50">
                              <th className="border border-gray-300 px-4 py-2 font-semibold text-left">
                                Day/Period
                              </th>
                              {PERIODS.slice(0, 6).map((p) => (
                                <th
                                  key={p}
                                  className="border border-gray-300 px-4 py-2 font-semibold text-center"
                                >
                                  P{p}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {DAYS.map((day) => (
                              <tr key={day}>
                                <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-50">
                                  {day}
                                </td>
                                {PERIODS.slice(0, 6).map((period) => {
                                  const entry = groupedTimetable[day]?.find(
                                    (e) => e.period === period
                                  );
                                  return (
                                    <td
                                      key={period}
                                      className="border border-gray-300 px-4 py-2 text-center text-xs"
                                    >
                                      {entry ? (
                                        <div className="bg-indigo-100 p-2 rounded">
                                          <p className="font-semibold text-indigo-800">
                                            {entry.subjectId?.code}
                                          </p>
                                          <p className="text-indigo-700 text-xs">
                                            {entry.startTime}-{entry.endTime}
                                          </p>
                                        </div>
                                      ) : (
                                        "-"
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : view === "view" ? (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar size={32} />
                    View Timetable
                  </h1>
                  <p className="text-gray-600 mt-2">Select batch, class, and section to view the timetable</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Filters Section */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-lg p-8 h-fit">
                      <h2 className="text-lg font-bold text-gray-800 mb-6">Select Timetable</h2>

                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Batch *
                          </label>
                          <select
                            value={formData.batchId}
                            onChange={handleBatchChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          >
                            <option value="">Select Batch</option>
                            {batches.map((batch) => (
                              <option key={batch._id} value={batch._id}>
                                {batch.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Class *
                          </label>
                          <select
                            value={formData.classId}
                            onChange={handleClassChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            disabled={!formData.batchId}
                          >
                            <option value="">Select Class</option>
                            {batchClasses.map((cls) => (
                              <option key={cls._id} value={cls._id}>
                                {cls.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Section *
                          </label>
                          <select
                            value={formData.sectionId}
                            name="sectionId"
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            disabled={!formData.classId || availableSections.length === 0}
                          >
                            <option value="">{availableSections.length === 0 ? "No sections" : "Select"}</option>
                            {availableSections.map((sec) => (
                              <option key={sec} value={sec}>
                                Section {sec}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={loadTimetable}
                          className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition mt-6"
                        >
                          Load Timetable
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Timetable View */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                      <h2 className="text-lg font-bold text-gray-800 mb-6">
                        Timetable - {PREDEFINED_CLASSES.find((c) => c._id === formData.classId)?.name} Section{" "}
                        {formData.sectionId}
                      </h2>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="bg-indigo-50">
                              <th className="border border-gray-300 px-4 py-2 font-semibold text-left">
                                Day/Period
                              </th>
                              {PERIODS.slice(0, 6).map((p) => (
                                <th
                                  key={p}
                                  className="border border-gray-300 px-4 py-2 font-semibold text-center"
                                >
                                  P{p}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {DAYS.map((day) => (
                              <tr key={day}>
                                <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-50">
                                  {day}
                                </td>
                                {PERIODS.slice(0, 6).map((period) => {
                                  const entry = groupedTimetable[day]?.find(
                                    (e) => e.period === period
                                  );
                                  return (
                                    <td
                                      key={period}
                                      className="border border-gray-300 px-4 py-2 text-center text-xs"
                                    >
                                      {entry ? (
                                        <div className="bg-indigo-100 p-2 rounded">
                                          <p className="font-semibold text-indigo-800">
                                            {entry.subjectId?.code}
                                          </p>
                                          <p className="text-indigo-700 text-xs">
                                            {entry.startTime}-{entry.endTime}
                                          </p>
                                          <p className="text-indigo-600 text-xs mt-1">
                                            {getTeacherName(entry.teacherId)?.split(' ')[0]}
                                          </p>
                                        </div>
                                      ) : (
                                        "-"
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : view === "viewAll" ? (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar size={32} />
                    View All Timetables
                  </h1>
                  <p className="text-gray-600 mt-2">View timetables for all sections of a class</p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      name="batchId"
                      value={filterData.batchId}
                      onChange={handleFilterChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="">Select Batch</option>
                      {batches.map((batch) => (
                        <option key={batch._id} value={batch._id}>
                          {batch.name}
                        </option>
                      ))}
                    </select>

                    <select
                      name="classId"
                      value={filterData.classId}
                      onChange={handleFilterChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      disabled={!filterData.batchId}
                    >
                      <option value="">Select Class</option>
                      {batchClasses.map((cls) => (
                        <option key={cls._id} value={cls._id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={loadAllTimetables}
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-semibold disabled:opacity-50"
                    >
                      {loading ? "Loading..." : "Show All Timetables"}
                    </button>
                  </div>

                  {error && (
                    <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                {allTimetables.length > 0 ? (
                  <div className="space-y-8">
                    {allTimetables.map((timetable) => (
                      <div key={timetable.section} className="bg-white rounded-lg shadow-lg p-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">
                          Section {timetable.section}
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm border-collapse">
                            <thead>
                              <tr className="bg-indigo-50">
                                <th className="border border-gray-300 px-4 py-2 font-semibold text-left">
                                  Day/Period
                                </th>
                                {PERIODS.slice(0, 6).map((p) => (
                                  <th
                                    key={p}
                                    className="border border-gray-300 px-4 py-2 font-semibold text-center"
                                  >
                                    P{p}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {DAYS.map((day) => (
                                <tr key={day}>
                                  <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-50">
                                    {day}
                                  </td>
                                  {PERIODS.slice(0, 6).map((period) => {
                                    const entry = timetable.entries?.find(
                                      (e) => e.day === day && e.period === period
                                    );
                                    return (
                                      <td
                                        key={period}
                                        className="border border-gray-300 px-4 py-2 text-center text-xs"
                                      >
                                        {entry ? (
                                          <div className="bg-indigo-100 p-2 rounded">
                                            <p className="font-semibold text-indigo-800">
                                              {entry.subjectId?.code}
                                            </p>
                                            <p className="text-indigo-700 text-xs">
                                              {entry.startTime}-{entry.endTime}
                                            </p>
                                            <p className="text-indigo-600 text-xs mt-1">
                                              {getTeacherName(entry.teacherId)?.split(' ')[0]}
                                            </p>
                                          </div>
                                        ) : (
                                          "-"
                                        )}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    Select batch and class, then click "Show All Timetables" to view all sections
                  </div>
                )}
              </>
            ) : view === "allocations" ? (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar size={32} />
                    Teacher Allocations
                  </h1>
                  <p className="text-gray-600 mt-2">View all teacher subject allocations for a class</p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      name="batchId"
                      value={filterData.batchId}
                      onChange={handleFilterChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="">Select Batch</option>
                      {batches.map((batch) => (
                        <option key={batch._id} value={batch._id}>
                          {batch.name}
                        </option>
                      ))}
                    </select>

                    <select
                      name="classId"
                      value={filterData.classId}
                      onChange={handleFilterChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      disabled={!filterData.batchId}
                    >
                      <option value="">Select Class</option>
                      {batchClasses.map((cls) => (
                        <option key={cls._id} value={cls._id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={loadAllAllocations}
                      disabled={loading}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-semibold disabled:opacity-50"
                    >
                      {loading ? "Loading..." : "Show All Allocations"}
                    </button>
                  </div>

                  {error && (
                    <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                {allAllocations.length > 0 ? (
                  <div className="space-y-8">
                    {allAllocations.map((alloc) => (
                      <div key={alloc.section} className="bg-white rounded-lg shadow-lg p-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">
                          Section {alloc.section}
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm border-collapse">
                            <thead>
                              <tr className="bg-indigo-50">
                                <th className="border border-gray-300 px-4 py-2 font-semibold text-left">Teacher Name</th>
                                <th className="border border-gray-300 px-4 py-2 font-semibold text-left">Subject</th>
                                <th className="border border-gray-300 px-4 py-2 font-semibold text-left">Email</th>
                              </tr>
                            </thead>
                            <tbody>
                              {alloc.allocations.length > 0 ? (
                                alloc.allocations.map((allocation, idx) => (
                                  <tr key={idx} className="border-b hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2 font-medium">
                                      {getTeacherName(allocation.teacherId)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                      {allocation.subjectId?.name}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-gray-600">
                                      {allocation.teacherId?.userId?.email}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="3" className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                                    No allocations
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    Select batch and class, then click "Show All Allocations" to view teacher allocations
                  </div>
                )}
              </>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
