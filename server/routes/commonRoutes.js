import express from "express";
import Batch from "../models/Batch.js";
import Class from "../models/Class.js";
import Section from "../models/Section.js";

const router = express.Router();

// Get all batches (public - no authentication required)
router.get("/batches", async (req, res) => {
  try {
    const batches = await Batch.find().lean();
    res.json(batches);
  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get all classes (public)
router.get("/classes", async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("batchId", "name batchCode")
      .populate("sectionId", "name")
      .lean();
    res.json({ classes });
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get sections for a specific batch and class (public)
router.get("/sections/:batchId/:classId", async (req, res) => {
  try {
    const { batchId, classId } = req.params;
    
    const sections = await Section.find({
      batchId,
      classId,
    })
      .select("name sectionCode")
      .lean();
    
    const sectionNames = sections.map((s) => s.name);
    
    res.json({ sections: sectionNames });
  } catch (error) {
    console.error("Error fetching sections:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
