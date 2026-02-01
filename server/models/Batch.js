import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    batchCode: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    strength: {
      type: Number,
      default: 0,
    },
    classes: [
      {
        classId: {
          type: String, // Store predefined class ID like "nursery", "class1", etc.
        },
        numberOfSections: {
          type: Number,
          required: true,
          default: 1,
        },
        capacity: {
          type: Number,
          default: 50,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Batch", batchSchema);
