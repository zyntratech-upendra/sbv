import express from "express";
import {
  getTeacherProfile,
  updateTeacherProfile,
  registerStudentByTeacher,
  getTeacherStudents,
  getTeacherClasses,
} from "../controllers/teacherController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to check if user is teacher
const teacherOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied. Teacher role required." });
  }
  next();
};

// Middleware to check if user is teacher or admin (for class viewing)
const teacherOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  if (req.user.role !== "teacher" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Teacher or Admin role required." });
  }
  next();
};

// Get teacher profile
router.get("/profile", protect, teacherOnly, getTeacherProfile);

// Update teacher profile
router.put("/profile", protect, teacherOnly, updateTeacherProfile);

// Register student
router.post(
  "/register-student",
  protect,
  teacherOrAdmin,
  registerStudentByTeacher
);

// Get teacher's students
router.get("/students", protect, teacherOnly, getTeacherStudents);

// Get teacher's classes
router.get("/classes", protect, teacherOrAdmin, getTeacherClasses);

export default router;
