const mongoose = require("mongoose");
const { InstructorRequestStatus } = require("../common/constants/documentStatus");
const { Schema } = mongoose;

const DOCUMENT_NAME ="instructor-request"
const COLLECTION_NAME = "instructor_requests"

const InstructorRequestSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: [InstructorRequestStatus.PENDING, InstructorRequestStatus.APPROVED, InstructorRequestStatus.REJECTED],
    default: InstructorRequestStatus.PENDING,
  },
  feedback: String, 
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

InstructorRequestSchema.index({ userId: 1 }, { unique: true });
InstructorRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model(DOCUMENT_NAME, InstructorRequestSchema);
