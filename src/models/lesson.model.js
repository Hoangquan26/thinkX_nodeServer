const mongoose = require("mongoose");
const { Schema } = mongoose;

const DOCUMENT_NAME = "lesson";
const COLLECTION_NAME = "lessons";

const LessonSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    lessonTitle: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: true,
    },
    duration: {
      type: String, //  "5m", "12m30s"
      default: "0m",
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, LessonSchema);
