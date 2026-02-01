import express from "express";
import {
  markAttendance,
  getClassAttendance,
  getStudentAttendance,
  getTeacherAttendanceReport,
  getClassStudents,
  getStudentAttendanceSummary,
  deleteAttendanceRecord,
  updateAttendanceRecord,
} from "../controllers/attendanceController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Mark attendance (teacher only)
router.post("/mark", protect, markAttendance);

// Get class attendance for a specific date/period
router.get("/class", protect, getClassAttendance);

// Get students in a class for attendance marking
router.get("/class-students", protect, getClassStudents);

// Get student's attendance record (student or teacher)
router.get("/student/:studentId", protect, getStudentAttendance);

// Get teacher's attendance report
router.get("/teacher-report", protect, getTeacherAttendanceReport);

// Get student attendance summary (for dashboard)
router.get("/summary/student", protect, getStudentAttendanceSummary);

// Update a single attendance record
router.put("/:attendanceId", protect, updateAttendanceRecord);

// Delete attendance record
router.delete("/:attendanceId", protect, deleteAttendanceRecord);

export default router;
