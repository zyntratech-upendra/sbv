import Subject from "../models/Subject.js";
import SubjectAllocation from "../models/SubjectAllocation.js";
import TeacherSubjectAllocation from "../models/TeacherSubjectAllocation.js";
import Timetable from "../models/Timetable.js";

// ======================== SUBJECT MANAGEMENT ========================

export const createSubject = async (req, res) => {
  try {
    const { name, code, description, hoursPerWeek } = req.body;

    const subjectExists = await Subject.findOne({ $or: [{ code }, { name }] });
    if (subjectExists)
      return res.status(400).json({ message: "Subject code or name already exists" });

    const subject = await Subject.create({
      name,
      code,
      description,
      hoursPerWeek: hoursPerWeek || 1,
    });

    res.status(201).json({
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ isActive: true });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, hoursPerWeek, isActive } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      id,
      { name, code, description, hoursPerWeek, isActive },
      { new: true }
    );

    if (!subject)
      return res.status(404).json({ message: "Subject not found" });

    res.json({
      message: "Subject updated successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!subject)
      return res.status(404).json({ message: "Subject not found" });

    res.json({
      message: "Subject deleted successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================== SUBJECT ALLOCATION ========================

export const allocateSubjectToClass = async (req, res) => {
  try {
    const { batchId, classId, subjectIds } = req.body;

    // Remove existing allocations for this batch/class combination
    await SubjectAllocation.deleteMany({ batchId, classId });

    // Create new allocations
    const allocations = await SubjectAllocation.insertMany(
      subjectIds.map((subjectId) => ({
        batchId,
        classId,
        subjectId,
      }))
    );

    res.status(201).json({
      message: "Subjects allocated successfully",
      allocations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubjectsForClass = async (req, res) => {
  try {
    const { batchId, classId } = req.params;

    const allocations = await SubjectAllocation.find({ batchId, classId })
      .populate("subjectId");

    const subjects = allocations.map((alloc) => alloc.subjectId);

    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================== TEACHER SUBJECT ALLOCATION ========================

export const allocateTeacherToSubject = async (req, res) => {
  try {
    const { batchId, classId, sectionId, subjectId, teacherId, startDate, endDate } = req.body;

    // Check if allocation already exists
    const existing = await TeacherSubjectAllocation.findOne({
      batchId,
      classId,
      sectionId,
      subjectId,
    });

    if (existing) {
      // Update existing allocation
      existing.teacherId = teacherId;
      existing.startDate = startDate;
      existing.endDate = endDate;
      await existing.save();

      return res.json({
        message: "Teacher allocation updated successfully",
        allocation: existing,
      });
    }

    const allocation = await TeacherSubjectAllocation.create({
      batchId,
      classId,
      sectionId,
      subjectId,
      teacherId,
      startDate,
      endDate,
    });

    res.status(201).json({
      message: "Teacher allocated to subject successfully",
      allocation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeacherSubjectAllocations = async (req, res) => {
  try {
    const { batchId, classId, sectionId } = req.params;

    const allocations = await TeacherSubjectAllocation.find({
      batchId,
      classId,
      sectionId,
    })
      .populate("subjectId")
      .populate({
        path: "teacherId",
        select: "userId employeeId",
        populate: {
          path: "userId",
          select: "name email"
        }
      });

    res.json(allocations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================== TIMETABLE MANAGEMENT ========================

export const createTimetableEntry = async (req, res) => {
  try {
    const {
      batchId,
      classId,
      sectionId,
      day,
      period,
      startTime,
      endTime,
      subjectId,
      teacherId,
      sectionCode,
    } = req.body;

    // Check if slot already exists
    const existing = await Timetable.findOne({
      batchId,
      classId,
      sectionId,
      day,
      period,
    });

    if (existing) {
      // Update existing entry
      existing.startTime = startTime;
      existing.endTime = endTime;
      existing.subjectId = subjectId;
      existing.teacherId = teacherId;
      existing.sectionCode = sectionCode;
      await existing.save();

      return res.json({
        message: "Timetable entry updated successfully",
        entry: existing,
      });
    }

    const entry = await Timetable.create({
      batchId,
      classId,
      sectionId,
      day,
      period,
      startTime,
      endTime,
      subjectId,
      teacherId,
      sectionCode,
    });

    res.status(201).json({
      message: "Timetable entry created successfully",
      entry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTimetable = async (req, res) => {
  try {
    const { batchId, classId, sectionId } = req.params;

    const timetable = await Timetable.find({
      batchId,
      classId,
      sectionId,
      isActive: true,
    })
      .populate("subjectId")
      .populate("teacherId", "userId employeeId")
      .populate("teacherId.userId", "name email")
      .sort({ day: 1, period: 1 });

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTimetableEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await Timetable.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!entry)
      return res.status(404).json({ message: "Timetable entry not found" });

    res.json({
      message: "Timetable entry deleted successfully",
      entry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateTimetable = async (req, res) => {
  try {
    const { batchId, classId, sectionId, periods, startTimes, days } = req.body;

    // Delete existing timetable for this section
    await Timetable.deleteMany({ batchId, classId, sectionId });

    // Get allocated subjects and teachers for this section
    const allocations = await TeacherSubjectAllocation.find({
      batchId,
      classId,
      sectionId,
      isActive: true,
    }).populate("subjectId");

    if (allocations.length === 0) {
      return res.status(400).json({
        message: "No teacher-subject allocations found for this section",
      });
    }

    const timetableEntries = [];
    let allocationIndex = 0;

    // Generate timetable entries
    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
      const day = days[dayIndex];
      for (let periodIndex = 0; periodIndex < periods; periodIndex++) {
        const period = periodIndex + 1;
        const allocation = allocations[allocationIndex % allocations.length];

        timetableEntries.push({
          batchId,
          classId,
          sectionId,
          day,
          period,
          startTime: startTimes[periodIndex],
          endTime: startTimes[periodIndex + 1] || "16:00",
          subjectId: allocation.subjectId._id,
          teacherId: allocation.teacherId,
          isActive: true,
        });

        allocationIndex++;
      }
    }

    const createdEntries = await Timetable.insertMany(timetableEntries);

    res.status(201).json({
      message: "Timetable generated successfully",
      entries: createdEntries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
