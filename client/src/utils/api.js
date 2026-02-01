import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (data) => api.post("/auth/register", data),
};

// Common endpoints (no authentication required)
export const commonAPI = {
  getBatches: () => api.get("/common/batches"),
  getClasses: () => api.get("/common/classes"),
  getSections: (batchId, classId) => api.get(`/common/sections/${batchId}/${classId}`),
};

// Admin endpoints
export const adminAPI = {
  registerStudent: (data) => api.post("/admin/register-student", data),
  registerTeacher: (data) => api.post("/admin/register-teacher", data),
  createClass: (data) => api.post("/admin/create-class", data),
  createBatch: (data) => api.post("/admin/create-batch", data),
  getAllStudents: () => api.get("/admin/students"),
  getAllTeachers: () => api.get("/admin/teachers"),
  getStudents: () => api.get("/admin/students"),
  getTeachers: () => api.get("/admin/teachers"),
  getClasses: () => api.get("/admin/classes"),
  getClassesDropdown: () => api.get("/admin/classes-dropdown"),
  getBatches: () => api.get("/admin/batches"),
  getBatchById: (id) => api.get(`/admin/batches/${id}`),
  updateBatch: (id, data) => api.put(`/admin/batches/${id}`, data),
  deleteBatch: (id) => api.delete(`/admin/batches/${id}`),
  getSections: (batchId, classId) => api.get(`/admin/sections/${batchId}/${classId}`),
};

// Teacher endpoints
export const teacherAPI = {
  getProfile: () => api.get("/teacher/profile"),
  updateProfile: (data) => api.put("/teacher/profile", data),
  registerStudent: (data) => api.post("/teacher/register-student", data),
  getStudents: () => api.get("/teacher/students"),
  getClasses: () => api.get("/teacher/classes"),
};

// Student endpoints
export const studentAPI = {
  getProfile: () => api.get("/student/profile"),
  updateProfile: (data) => api.put("/student/profile", data),
  getDashboard: () => api.get("/student/dashboard"),
  register: (data) => api.post("/teacher/register-student", data),
};

// Subject endpoints
export const subjectAPI = {
  create: (data) => api.post("/subject/subjects", data),
  getAll: () => api.get("/subject/subjects"),
  update: (id, data) => api.put(`/subject/subjects/${id}`, data),
  delete: (id) => api.delete(`/subject/subjects/${id}`),
  allocate: (data) => api.post("/subject/allocate-subjects", data),
  getSubjectsForClass: (batchId, classId) =>
    api.get(`/subject/subjects/${batchId}/${classId}`),
};

// Timetable endpoints
export const timetableAPI = {
  allocateTeacher: (data) => api.post("/subject/allocate-teacher-subject", data),
  getTeacherAllocations: (batchId, classId, sectionId) =>
    api.get(`/subject/teacher-allocations/${batchId}/${classId}/${sectionId}`),
  createEntry: (data) => api.post("/subject/timetable", data),
  getTimetable: (batchId, classId, sectionId) =>
    api.get(`/subject/timetable/${batchId}/${classId}/${sectionId}`),
  deleteEntry: (id) => api.delete(`/subject/timetable/${id}`),
  generate: (data) => api.post("/subject/generate-timetable", data),
};

// Attendance endpoints
export const attendanceAPI = {
  markAttendance: (data) => api.post("/attendance/mark", data),
  getClassAttendance: (params) => api.get("/attendance/class", { params }),
  getClassStudents: (params) => api.get("/attendance/class-students", { params }),
  getStudentAttendance: (studentId, params) =>
    api.get(`/attendance/student/${studentId}`, { params }),
  getTeacherReport: (params) => api.get("/attendance/teacher-report", { params }),
  getStudentSummary: () => api.get("/attendance/summary/student"),
  updateRecord: (id, data) => api.put(`/attendance/${id}`, data),
  deleteRecord: (id) => api.delete(`/attendance/${id}`),
};

export default api;
