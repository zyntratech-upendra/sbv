import User from "../models/User.js";
import Student from "../models/Student.js";
import bcrypt from "bcryptjs";

// Get student profile
export const getStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    const student = await Student.findOne({ userId })
      .populate("batchId", "name")
      .populate("classId", "name");

    if (!user || !student)
      return res.status(404).json({ message: "Student not found" });

    res.json({
      profile: {
        ...user.toObject(),
        ...student.toObject(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update student profile
export const updateStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, profilePicture, address } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone, profilePicture },
      { new: true }
    );

    const student = await Student.findOneAndUpdate(
      { userId },
      { address },
      { new: true }
    );

    res.json({
      message: "Profile updated successfully",
      profile: { ...user.toObject(), ...student.toObject() },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student dashboard data
export const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const student = await Student.findOne({ userId })
      .populate("userId", "name email")
      .populate("classId", "name description")
      .populate("batchId", "name startDate endDate");

    if (!student)
      return res.status(404).json({ message: "Student not found" });

    res.json({
      student,
      dashboard: {
        className: student.classId?.name,
        batchName: student.batchId?.name,
        registrationNumber: student.registrationNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
