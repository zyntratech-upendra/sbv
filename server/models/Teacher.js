import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeId: {
      type: String,
      unique: true,
      required: true,
    },
    department: {
      type: String,
    },
    qualifications: {
      type: String,
    },
    specialization: {
      type: String,
    },
    classIds: [
      {
        type: String, // Store predefined class IDs like "nursery", "class1", etc.
      },
    ],
    joiningDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
