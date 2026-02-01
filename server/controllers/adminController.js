import User from "../models/User.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Class from "../models/Class.js";
import Batch from "../models/Batch.js";
import Section from "../models/Section.js";
import bcrypt from "bcryptjs";

// Register Student
export const registerStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      dateOfBirth,
      address,
      guardianName,
      guardianPhone,
      batchId,
      classId,
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already exists" });

    // Create user
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = "Student@123";
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      phone,
    });

    // Create student record
    const registrationNumber = `STU-${Date.now()}`;
    const student = await Student.create({
      userId: user._id,
      registrationNumber,
      dateOfBirth,
      address,
      guardianName,
      guardianPhone,
      batchId,
      classId,
    });

    res.status(201).json({
      message: "Student registered successfully",
      student,
      loginDetails: {
        email,
        defaultPassword,
        note: "Please change password on first login",
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register Teacher
export const registerTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      department,
      qualifications,
      specialization,
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already exists" });

    // Create user
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = "Teacher@123";
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
      phone,
    });

    // Create teacher record
    const employeeId = `EMP-${Date.now()}`;
    const teacher = await Teacher.create({
      userId: user._id,
      employeeId,
      department,
      qualifications,
      specialization,
    });

    res.status(201).json({
      message: "Teacher registered successfully",
      teacher,
      loginDetails: {
        email,
        defaultPassword,
        note: "Please change password on first login",
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Class
export const createClass = async (req, res) => {
  try {
    const { name, classCode, description, capacity, teacherId, batchId } =
      req.body;

    const classExists = await Class.findOne({ classCode });
    if (classExists)
      return res.status(400).json({ message: "Class code already exists" });

    const newClass = await Class.create({
      name,
      classCode,
      description,
      capacity,
      teacherId,
      batchId,
    });

    res.status(201).json({
      message: "Class created successfully",
      class: newClass,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Batch with Classes and Sections
export const createBatch = async (req, res) => {
  try {
    const { name, batchCode, description, startDate, endDate, classes } =
      req.body;

    // Validate required fields
    if (!name || !batchCode || !startDate || !endDate) {
      return res.status(400).json({ 
        message: "Missing required fields: name, batchCode, startDate, endDate" 
      });
    }

    const batchExists = await Batch.findOne({ batchCode });
    if (batchExists)
      return res.status(400).json({ message: "Batch code already exists" });

    const batch = await Batch.create({
      name,
      batchCode,
      description: description || "",
      startDate,
      endDate,
      classes: classes || [],
    });

    // Create sections for each class in the batch
    if (classes && classes.length > 0) {
      for (const classItem of classes) {
        for (let i = 0; i < classItem.numberOfSections; i++) {
          const sectionName = String.fromCharCode(65 + i); // A, B, C, etc.
          const sectionCode = `${batchCode}-${classItem.classId}-${sectionName}`;
          
          await Section.create({
            batchId: batch._id,
            classId: classItem.classId,
            sectionName,
            sectionCode,
            capacity: classItem.capacity || 50,
          });
        }
      }
    }

    res.status(201).json({
      message: "Batch created successfully",
      batch,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("userId", "name email phone")
      .populate("batchId", "name");

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("userId", "name email phone")
      .populate("classIds", "name");

    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all classes
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("teacherId", "name email")
      .populate("batchId", "name");

    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all batches
export const getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find().lean();
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get batch by ID
export const getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id).lean();
    
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Get sections for this batch
    const sections = await Section.find({ batchId: batch._id })
      .lean();

    res.json({ batch, sections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Batch
export const updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate, classes } = req.body;

    const batch = await Batch.findById(id);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Update basic fields
    batch.name = name || batch.name;
    batch.description = description !== undefined ? description : batch.description;
    batch.startDate = startDate || batch.startDate;
    batch.endDate = endDate || batch.endDate;

    // Handle class updates
    if (classes && classes.length > 0) {
      batch.classes = classes;
      
      // Delete old sections and create new ones
      await Section.deleteMany({ batchId: batch._id });
      
      for (const classItem of classes) {
        for (let i = 0; i < classItem.numberOfSections; i++) {
          const sectionName = String.fromCharCode(65 + i);
          const sectionCode = `${batch.batchCode}-${classItem.classId}-${sectionName}`;
          
          await Section.create({
            batchId: batch._id,
            classId: classItem.classId,
            sectionName,
            sectionCode,
            capacity: classItem.capacity || 50,
          });
        }
      }
    }

    await batch.save();

    res.json({
      message: "Batch updated successfully",
      batch,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Batch
export const deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;

    const batch = await Batch.findByIdAndDelete(id);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Delete associated sections
    await Section.deleteMany({ batchId: id });

    res.json({
      message: "Batch deleted successfully",
      batch,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all classes (for dropdowns)
export const getClassesForDropdown = async (req, res) => {
  try {
    const classes = await Class.find({ isActive: true }).select("_id name classCode");
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sections for a batch and class
export const getSections = async (req, res) => {
  try {
    const { batchId, classId } = req.params;

    const sections = await Section.find({
      batchId,
      classId,
      isActive: true,
    }).select("_id sectionName sectionCode capacity");

    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
