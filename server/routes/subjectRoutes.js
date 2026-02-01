import express from "express";
import {
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
  allocateSubjectToClass,
  getSubjectsForClass,
  allocateTeacherToSubject,
  getTeacherSubjectAllocations,
  createTimetableEntry,
  getTimetable,
  deleteTimetableEntry,
  generateTimetable,
} from "../controllers/subjectController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Access denied" });
  next();
};

// ======================== SUBJECT MANAGEMENT ========================
router.post("/subjects", protect, adminOnly, createSubject);
router.get("/subjects", protect, adminOnly, getAllSubjects);
router.put("/subjects/:id", protect, adminOnly, updateSubject);
router.delete("/subjects/:id", protect, adminOnly, deleteSubject);

// ======================== SUBJECT ALLOCATION ========================
router.post("/allocate-subjects", protect, adminOnly, allocateSubjectToClass);
router.get("/subjects/:batchId/:classId", protect, adminOnly, getSubjectsForClass);

// ======================== TEACHER SUBJECT ALLOCATION ========================
router.post("/allocate-teacher-subject", protect, adminOnly, allocateTeacherToSubject);
router.get(
  "/teacher-allocations/:batchId/:classId/:sectionId",
  protect,
  adminOnly,
  getTeacherSubjectAllocations
);

// ======================== TIMETABLE MANAGEMENT ========================
router.post("/timetable", protect, adminOnly, createTimetableEntry);
router.get("/timetable/:batchId/:classId/:sectionId", protect, getTimetable);
router.delete("/timetable/:id", protect, adminOnly, deleteTimetableEntry);
router.post("/generate-timetable", protect, adminOnly, generateTimetable);

export default router;
