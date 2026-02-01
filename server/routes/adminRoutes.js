import express from "express";
import {
  registerStudent,
  registerTeacher,
  createClass,
  createBatch,
  getAllStudents,
  getAllTeachers,
  getAllClasses,
  getAllBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
  getClassesForDropdown,
  getSections,
} from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Access denied" });
  next();
};

// Register student
router.post("/register-student", protect, adminOnly, registerStudent);

// Register teacher
router.post("/register-teacher", protect, adminOnly, registerTeacher);

// Create class
router.post("/create-class", protect, adminOnly, createClass);

// Create batch
router.post("/create-batch", protect, adminOnly, createBatch);

// Get all students
router.get("/students", protect, adminOnly, getAllStudents);

// Get all teachers
router.get("/teachers", protect, adminOnly, getAllTeachers);

// Get all classes
router.get("/classes", protect, adminOnly, getAllClasses);

// Get classes for dropdown
router.get("/classes-dropdown", protect, adminOnly, getClassesForDropdown);

// Get all batches
router.get("/batches", protect, adminOnly, getAllBatches);

// Get batch by ID
router.get("/batches/:id", protect, adminOnly, getBatchById);

// Update batch
router.put("/batches/:id", protect, adminOnly, updateBatch);

// Delete batch
router.delete("/batches/:id", protect, adminOnly, deleteBatch);

// Get sections for a batch and class
router.get("/sections/:batchId/:classId", protect, adminOnly, getSections);

export default router;
