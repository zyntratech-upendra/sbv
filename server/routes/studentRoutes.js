import express from "express";
import {
  getStudentProfile,
  updateStudentProfile,
  getStudentDashboard,
} from "../controllers/studentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to check if user is student
const studentOnly = (req, res, next) => {
  if (req.user.role !== "student")
    return res.status(403).json({ message: "Access denied" });
  next();
};

// Get student profile
router.get("/profile", protect, studentOnly, getStudentProfile);

// Update student profile
router.put("/profile", protect, studentOnly, updateStudentProfile);

// Get student dashboard
router.get("/dashboard", protect, studentOnly, getStudentDashboard);

export default router;
