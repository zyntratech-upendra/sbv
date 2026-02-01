import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import Timetable from "../models/Timetable.js";
import User from "../models/User.js";

// Mark attendance for multiple students
export const markAttendance = async (req, res) => {
  try {
    const { batchId, classId, sectionId, subjectId, teacherId, date, period, attendance } = req.body;

    if (!batchId || !classId || !sectionId || !subjectId || !teacherId || !date || !period || !attendance) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // attendance should be an array of { studentId, status }
    if (!Array.isArray(attendance) || attendance.length === 0) {
      return res.status(400).json({ message: "Attendance data must be a non-empty array" });
    }

    // Prepare attendance records
    const attendanceRecords = attendance.map((att) => ({
      batchId,
      classId,
      sectionId,
      subjectId,
      teacherId,
      studentId: att.studentId,
      date: new Date(date),
      period,
      status: att.status || "absent",
    }));

    // Delete existing attendance for this period first
    await Attendance.deleteMany({
      batchId,
      classId,
      sectionId,
      subjectId,
      date: new Date(date),
      period,
    });

    // Create new attendance records
    const created = await Attendance.insertMany(attendanceRecords);

    res.json({
      message: "Attendance marked successfully",
      count: created.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance for a specific class/section/date
export const getClassAttendance = async (req, res) => {
  try {
    const { batchId, classId, sectionId, date, period } = req.query;

    if (!batchId || !classId || !sectionId || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = {
      batchId,
      classId,
      sectionId,
      date: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).getTime() + 86400000), // Next day
      },
    };

    if (period) query.period = parseInt(period);

    const attendance = await Attendance.find(query)
      .populate("studentId", "registrationNumber")
      .populate("subjectId", "name code")
      .populate("teacherId", "name")
      .sort("period");

    res.json({ attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student's attendance record
export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId, startDate, endDate } = req.query;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const query = { studentId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(query)
      .populate("subjectId", "name code")
      .populate("teacherId", "name")
      .sort("-date period");

    // Calculate statistics
    const total = attendance.length;
    const present = attendance.filter((a) => a.status === "present").length;
    const absent = attendance.filter((a) => a.status === "absent").length;
    const leave = attendance.filter((a) => a.status === "leave").length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    res.json({
      attendance,
      statistics: {
        total,
        present,
        absent,
        leave,
        percentage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance report for teacher
export const getTeacherAttendanceReport = async (req, res) => {
  try {
    const teacherId = req.user?.id || req.query.teacherId;
    const { batchId, classId, sectionId, startDate, endDate } = req.query;

    if (!teacherId) {
      return res.status(400).json({ message: "Teacher ID is required" });
    }

    const query = { teacherId };

    if (batchId) query.batchId = batchId;
    if (classId) query.classId = classId;
    if (sectionId) query.sectionId = sectionId;

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(query)
      .populate("studentId", "registrationNumber")
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("subjectId", "name code")
      .sort("-date period");

    // Group by student
    const reportByStudent = {};
    attendance.forEach((record) => {
      const studentId = record.studentId._id.toString();
      if (!reportByStudent[studentId]) {
        reportByStudent[studentId] = {
          studentId: record.studentId._id,
          registrationNumber: record.studentId.registrationNumber,
          name: record.studentId.userId.name,
          email: record.studentId.userId.email,
          total: 0,
          present: 0,
          absent: 0,
          leave: 0,
        };
      }

      reportByStudent[studentId].total++;
      reportByStudent[studentId][record.status]++;
    });

    // Calculate percentages
    const report = Object.values(reportByStudent).map((student) => ({
      ...student,
      percentage: student.total > 0 ? ((student.present / student.total) * 100).toFixed(2) : 0,
    }));

    res.json({
      report,
      totalRecords: attendance.length,
      periodStart: startDate || "N/A",
      periodEnd: endDate || "N/A",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get students for a class (for marking attendance)
export const getClassStudents = async (req, res) => {
  try {
    const { batchId, classId, sectionId } = req.query;

    if (!batchId || !classId) {
      return res.status(400).json({ message: "Batch ID and Class ID are required" });
    }

    const query = { batchId, classId };
    if (sectionId) query.sectionId = sectionId;

    const students = await Student.find(query)
      .populate("userId", "name email phone")
      .select("registrationNumber sectionId userId");

    res.json({ students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance summary for student dashboard
export const getStudentAttendanceSummary = async (req, res) => {
  try {
    const studentId = req.user?.student?._id || req.query.studentId;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    // Get last 30 days of attendance
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const attendance = await Attendance.find({
      studentId,
      date: { $gte: thirtyDaysAgo },
    });

    const total = attendance.length;
    const present = attendance.filter((a) => a.status === "present").length;
    const absent = attendance.filter((a) => a.status === "absent").length;
    const leave = attendance.filter((a) => a.status === "leave").length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    // Group by date
    const byDate = {};
    attendance.forEach((record) => {
      const dateStr = new Date(record.date).toLocaleDateString("en-GB");
      if (!byDate[dateStr]) byDate[dateStr] = { present: 0, absent: 0, leave: 0 };
      byDate[dateStr][record.status]++;
    });

    res.json({
      summary: {
        total,
        present,
        absent,
        leave,
        percentage,
        period: "Last 30 days",
      },
      byDate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete attendance record (for corrections)
export const deleteAttendanceRecord = async (req, res) => {
  try {
    const { attendanceId } = req.params;

    const record = await Attendance.findByIdAndDelete(attendanceId);

    if (!record) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update single attendance record
export const updateAttendanceRecord = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { status } = req.body;

    if (!["present", "absent", "leave"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const record = await Attendance.findByIdAndUpdate(
      attendanceId,
      { status },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.json({ message: "Attendance record updated", record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
