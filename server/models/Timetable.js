import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    classId: {
      type: String, // Predefined class ID
      required: true,
    },
    sectionId: {
      type: String, // Section like "A", "B", "C"
      required: true,
    },
    day: {
      type: String, // Monday, Tuesday, etc.
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      required: true,
    },
    period: {
      type: Number, // 1, 2, 3, etc.
      required: true,
    },
    startTime: {
      type: String, // HH:MM format
      required: true,
    },
    endTime: {
      type: String, // HH:MM format
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    sectionCode: {
      type: String, // e.g., "BATCH-2025-nursery-A"
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound unique index to prevent duplicate timetable entries
timetableSchema.index(
  { batchId: 1, classId: 1, sectionId: 1, day: 1, period: 1 },
  { unique: true }
);

export default mongoose.model("Timetable", timetableSchema);
