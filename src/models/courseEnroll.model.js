const mongoose = require("mongoose");
const { Schema } = mongoose;

const DOCUMENT_NAME = "enrollment";
const COLLECTION_NAME = "enrollments";

const EnrollmentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    course: { type: Schema.Types.ObjectId, ref: "course", required: true },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 }, // percent
    status: {
      type: String,
      enum: ["ENROLLED", "COMPLETED"],
      default: "ENROLLED"
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model(DOCUMENT_NAME, EnrollmentSchema);
