import User from "../models/User.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import bcrypt from "bcryptjs";

// Get teacher profile
export const getTeacherProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    const teacher = await Teacher.findOne({ userId })
      .populate("classIds", "name classCode")
      .lean();

    if (!user || !teacher)
      return res.status(404).json({ message: "Teacher not found" });

    res.json({
      profile: {
        ...user.toObject(),
        ...teacher,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update teacher profile
export const updateTeacherProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, profilePicture, qualifications, specialization } =
      req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone, profilePicture },
      { new: true }
    );

    const teacher = await Teacher.findOneAndUpdate(
      { userId },
      { qualifications, specialization },
      { new: true }
    );

    res.json({
      message: "Profile updated successfully",
      profile: { ...user.toObject(), ...teacher.toObject() },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Teacher register student
export const registerStudentByTeacher = async (req, res) => {
  try {
    const teacherId = req.user.id;
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
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get teacher's students
export const getTeacherStudents = async (req, res) => {
  try {
    const userId = req.user.id;

    const teacher = await Teacher.findOne({ userId });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const students = await Student.find({
      classId: { $in: teacher.classIds },
    })
      .populate("userId", "name email phone")
      .populate("classId", "name");

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get teacher's classes
export const getTeacherClasses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let teacher;
    if (userRole === "teacher") {
      teacher = await Teacher.findOne({ userId })
        .populate({
          path: "classIds",
          populate: [
            { path: "batchId", select: "name" },
            { path: "sectionId", select: "name" },
          ],
        });

      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
    } else if (userRole === "admin") {
      // For admin, return all classes
      const Class = require("../models/Class.js").default;
      const allClasses = await Class.find()
        .populate({ path: "batchId", select: "name" })
        .populate({ path: "sectionId", select: "name" });
      
      const classesWithStudents = await Promise.all(
        allClasses.map(async (cls) => {
          const studentCount = await Student.countDocuments({ classId: cls._id });
          return {
            ...cls.toObject(),
            students: Array(studentCount).fill(null),
          };
        })
      );

      return res.json({ classes: classesWithStudents });
    }

    // For teacher, get their classes
    const classesWithStudents = await Promise.all(
      (teacher?.classIds || []).map(async (cls) => {
        const studentCount = await Student.countDocuments({ classId: cls._id });
        return {
          ...cls.toObject(),
          students: Array(studentCount).fill(null),
        };
      })
    );

    res.json({ classes: classesWithStudents });
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: error.message });
  }
};