import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    classId: {
      type: String, // Store predefined class ID like "nursery", "class1", etc.
      required: true,
    },
    sectionName: {
      type: String,
      required: true, // e.g., "A", "B", "C"
    },
    sectionCode: {
      type: String,
      unique: true,
      required: true, // e.g., "10A-2024-A"
    },
    capacity: {
      type: Number,
      default: 50,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Section", sectionSchema);
