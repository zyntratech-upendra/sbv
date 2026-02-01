import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    classId: {
      type: String,
      required: true,
    },
    sectionId: {
      type: String,
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    period: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "leave"],
      default: "absent",
    },
  },
  { timestamps: true }
);

// Create compound index for efficient queries
attendanceSchema.index({
  studentId: 1,
  date: 1,
  period: 1,
  subjectId: 1,
});

attendanceSchema.index({
  batchId: 1,
  classId: 1,
  sectionId: 1,
  date: 1,
});

attendanceSchema.index({
  teacherId: 1,
  date: 1,
});

export default mongoose.model("Attendance", attendanceSchema);
