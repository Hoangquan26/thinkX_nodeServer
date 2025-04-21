'use strict'

const { NotFoundError, BadRequestError, ForbiddenError } = require("../common/responses/errorReponse");
const lessonModel = require("../models/lesson.model");
const courseModel = require("../models/course.model");
const { convertObjectId } = require("../utils/mongo");
const EnrollmentModel = require('../models/courseEnroll.model');
const redisClient = require("../providers/redis.provider");
const REDIS_KEY = require("../common/constants/redis.contant");
const { formatPaginatedResponse } = require('../helpers/asyncHandle')

class LessonService {
  static async createLesson({
    lessonTitle,
    description,
    courseId,
    videoUrl,
    order,
    instructor,
    isPreview,
    duration
  }) {
    const course = await courseModel.findById(convertObjectId(courseId));
    if (!course) throw new NotFoundError("Course not found");
  
    const existing = await lessonModel.findOne({ course: courseId, order });
    if (existing) {
      throw new BadRequestError(`Bài học với thứ tự #${order} đã tồn tại trong khóa học`);
    }
  
    const numberedTitle = `#${order} ${lessonTitle}`;
  
    const lesson = await lessonModel.create({
      lessonTitle: numberedTitle,
      description,
      course: courseId,
      videoUrl,
      order,
      instructor,
      duration,
      isPreview: isPreview ?? false,
    });
  
    course.lessons.push(lesson._id);
    await course.save();
  
    // Clear cache
    await redisClient.del(REDIS_KEY.getCourseDetailBySlug(course.slug));
  
    return lesson;
  }

  static getPublicLessons = async (courseId) => {
    const lessons = await lessonModel.find({
      course: convertObjectId(courseId)
    })
    .sort({ order: 1 })
    .select("lessonTitle description isPreview duration")
    .lean();

    return lessons;
  }

  static getLearningLessons = async (userId, courseId) => {
    const isEnrolled = await EnrollmentModel.findOne({
      user: convertObjectId(userId),
      course: convertObjectId(courseId),
    });
  
    if (!isEnrolled) {
      throw new ForbiddenError("Bạn chưa đăng ký khóa học này.");
    }

    const lessons = await lessonModel.find({
      course: convertObjectId(courseId)
    })
    
    .sort({ order: 1 })
    .lean();
    return lessons;
  }
  

  static getAllMyLessons = async(instructorId) => {
    console.log('---get instructor lesson')
    const lessons = await lessonModel.find({ instructor: convertObjectId(instructorId) })
      .populate("course", "courseName slug")
      .sort({ createdAt: -1 })
      .lean();
  
    return lessons;
  };
  

  static async updateLesson(id, payload) {
    const lesson = await lessonModel.findById(convertObjectId(id));
    if (!lesson) throw new NotFoundError("Lesson not found");
  
    if (
      payload.order !== undefined &&
      payload.order !== lesson.order
    ) {
      const isOrderExist = await lessonModel.exists({
        course: lesson.course,
        order: payload.order,
        _id: { $ne: lesson._id },
      });
  
      if (isOrderExist) {
        throw new BadRequestError(`Order ${payload.order} đã tồn tại trong khóa học này.`);
      }
  
      if (payload.lessonTitle && !payload.lessonTitle.startsWith(`#${payload.order}`)) {
        payload.lessonTitle = `#${payload.order} ${payload.lessonTitle}`;
      }
    }
  
    // Cập nhật an toàn
    Object.keys(payload).forEach((key) => {
      const value = payload[key];
      if (value !== undefined && value !== null) {
        lesson[key] = value;
      }
    });
  
    await lesson.save();
  
    return lesson;
  }
  

  static async deleteLesson(id, instructorId) {
    const lesson = await lessonModel.findOne({
      _id: convertObjectId(id),
      instructor: convertObjectId(instructorIdid),
    })
    if (!lesson) throw new NotFoundError("Lesson not found");

    // Remove lesson from course
    await courseModel.updateOne(
      { _id: lesson.course },
      { $pull: { lessons: lesson._id } }
    );

   
    return await lesson.deleteOne()
  }

  static async getLessonById(id) {
    const lesson = await lessonModel.findById(id).lean();
    if (!lesson) throw new NotFoundError("Lesson not found");

    return lesson;
  }

  static async getLessonsByCourse(courseId, userId = null) {
    const course = await courseModel.findById(convertObjectId(courseId)).lean();
    if (!course) throw new NotFoundError("Course not found");

    const query = { course: courseId };
    if (userId) {
      // có thể thêm kiểm tra enroll user nếu cần
    }

    const lessons = await lessonModel.find(query).sort({ order: 1 }).lean();
    return lessons;
  }

  static async getAllLessonsForAdmin({ page = 1, limit = 10, query = "", courseId = "" }) {
    const filter = {};

    if (query) {
      filter.lessonTitle = { $regex: query, $options: "i" };
    }

    if (courseId) {
      filter.course = convertObjectId(courseId);
    }

    const skip = (page - 1) * limit;

    const [lessons, total] = await Promise.all([
      lessonModel.find(filter)
        .populate("course", "courseName")
        .populate("instructor", "username")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      lessonModel.countDocuments(filter)
    ]);

    return formatPaginatedResponse({
      metadata: lessons,
      page,
      limit,
      total
    });
  }

  static async forceDeleteLesson(id) {
    const lesson = await lessonModel.findByIdAndDelete(convertObjectId(id));
    if (!lesson) throw new NotFoundError("Lesson not found");

    await courseModel.updateOne(
      { _id: lesson.course },
      { $pull: { lessons: lesson._id } }
    );

    return { deleted: true, lessonId: lesson._id };
  }
}

module.exports = LessonService;
