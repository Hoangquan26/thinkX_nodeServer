const Joi = require("joi");

const createCourseSchema = Joi.object({
  courseName: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Course name is required",
    "string.min": "Course name must be at least 3 characters",
    "string.max": "Course name must be at most 100 characters",
  }),

  courseDescription: Joi.string().min(10).required().messages({
    "string.empty": "Course description is required",
    "string.min": "Course description must be at least 10 characters",
  }),

  coursePrice: Joi.number().min(0).required().messages({
    "number.base": "Course price must be a number",
    "number.min": "Course price must be at least 0",
  }),

  category: Joi.string().required().messages({
    "string.empty": "Category ID is required",
  }),

  courseThumb: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Thumbnail must be a valid URL",
  }),

  courseLength: Joi.string().optional().allow(""),

  courseLessonCount: Joi.number().integer().min(0).optional(),

  courseRating: Joi.number().min(0).max(5).optional(),

  courseStudentCount: Joi.number().integer().min(0).optional(),
});



const updateCourseSchema = Joi.object({
  courseName: Joi.string().min(3).max(100).messages({
    "string.min": "Course name must be at least 3 characters",
    "string.max": "Course name must be at most 100 characters",
  }),

  courseDescription: Joi.string().min(10).messages({
    "string.min": "Course description must be at least 10 characters",
  }),

  coursePrice: Joi.number().min(0).messages({
    "number.min": "Course price must be at least 0",
  }),

  category: Joi.string().messages({
    "string.empty": "Category ID cannot be empty",
  }),

  courseThumb: Joi.string().uri().allow("").messages({
    "string.uri": "Thumbnail must be a valid URL",
  }),

  courseLength: Joi.string().allow(""),

  courseLessonCount: Joi.number().integer().min(0),

  courseRating: Joi.number().min(0).max(5),

  courseStudentCount: Joi.number().integer().min(0),

  isPublished: Joi.boolean(),
});

module.exports = {
  createCourseSchema,
  updateCourseSchema
};


