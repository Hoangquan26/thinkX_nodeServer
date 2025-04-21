const mongoose = require("mongoose");
const { Schema } = mongoose;
const slugify = require("slugify");
const { CourseStatus } = require('../common/constants/courseStatus')
const DOCUMENT_NAME = "course";
const COLLECTION_NAME = "courses";

const CourseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    courseDescription: {
      type: String,
      required: true,
    },
    coursePrice: {
      type: Number,
      required: true,
      default: 0,
    },
    courseThumb: {
      type: String,
      default: "",
    },
    courseLength: {
      type: String,
      default: "0h",
    },
    courseLessonCount: {
      type: Number,
      default: 0,
    },
    courseRating: {
      type: Number,
      default: 0,
    },
    courseStudentCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: Object.values(CourseStatus),
      default: CourseStatus.DRAFT,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },

    instructor: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "lesson",
      },
    ],
    feedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

CourseSchema.pre("save", function (next) {
  if (this.isModified("courseName")) {
    this.slug = slugify(this.courseName, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model(DOCUMENT_NAME, CourseSchema);

