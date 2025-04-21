const REDIS_KEY = require("../common/constants/redis.contant");
const {
  NotFoundError,
  BadRequestError,
} = require("../common/responses/errorReponse");
const courseModel = require("../models/course.model");
const redisClient = require("../providers/redis.provider");
const categoryModel = require("../models/category.model");
const { convertObjectId } = require("../utils/mongo");
const { CourseStatus } = require("../common/constants/courseStatus");
const lessonModel = require("../models/lesson.model");
const enrollmentModel = require("../models/courseEnroll.model");
const { formatPaginatedResponse } = require("../helpers/responseFormat");

class CourseService {
  // -1 = DESC, 1 = ASC
  static getAllCoursesPublic = async ({ page = 1, limit = 10, query = "", sortField = "createdAt", sortOrder = -1,  }) => {
    // const cacheKey = REDIS_KEY.PUBLIC_COURSE_LIST({ page, limit, query });

    // const cached = await redisClient.get(cacheKey);
    // if (cached) {
    //   return JSON.parse(cached);
    // }
    const sortOption = { [sortField]: sortOrder };
    const filter = {};
    if (query) {
      filter.courseName = { $regex: query, $options: "i" };
    }
    console.log(sortOption);
    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      courseModel
        .find({ ...filter, status: CourseStatus.PUBLISHED })
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate("category", "name slug")
        .populate("instructor", "username")
        .select(
          "courseName courseThumb slug coursePrice courseRating courseStudentCount instructor courseLength courseLessonCount"
        )
        .lean(),
      courseModel.countDocuments({ ...filter, status: CourseStatus.PUBLISHED }),
    ]);

    const response = formatPaginatedResponse({
      metadata: courses,
      page,
      limit,
      total,
    });

    // await redisClient.set(cacheKey, JSON.stringify(response), {
    //   EX: REDIS_KEY.PUBLIC_COURSE_LIST_EX,
    // });

    return response;
  };

  static getCourseBySlug = async (slug) => {
    const cacheKey = REDIS_KEY.getCourseDetailBySlug(slug);
  
    // Kiểm tra cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  
    // Truy vấn database
    const course = await courseModel
      .findOne({
        slug,
        status: CourseStatus.PUBLISHED,
      })
      .populate("category", "name slug")
      .populate("instructor", "username email") // ➕ load instructor info
      .select("courseName courseThumb coursePrice slug courseDescription courseLength courseLessonCount courseStudentCount courseRating category instructor") 
      .lean();
  
    if (!course) {
      throw new NotFoundError("Course not found");
    }
  
    // Cache lại kết quả
    await redisClient.set(cacheKey, JSON.stringify(course), {
      EX: REDIS_KEY.CourseDetailBySlug_EX,
    });
  
    return course;
  };

  static getCoursesByCategorySlug = async (slug) => {
    const cacheKey = REDIS_KEY.getCoursesByCategorySlug(slug);
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const category = await categoryModel.findOne({ slug }).lean();
    if (!category) throw new NotFoundError("Category not found");

    const courses = await courseModel
      .find({
        category: category._id,
        status: CourseStatus.PUBLISHED,
      })
      .select(
        "courseName courseThumb slug coursePrice courseRating courseStudentCount courseLength"
      )
      .lean();

    await redisClient.set(cacheKey, JSON.stringify(courses), {
      EX: REDIS_KEY.PUBLIC_COURSE_LIST_EX,
    });

    return courses;
  };

  static getCoursesByInstructor = async (instructorId, status) => {
    const filter = { instructor: convertObjectId(instructorId) };
    if (status && status !== "ALL") {
      filter.status = status;
    }

    const courses = await courseModel
      .find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    return courses;
  };

  static createCourse = async ({
    courseName,
    courseDescription,
    coursePrice,
    courseThumb,
    category,
    instructor,
  }) => {
    const course = await courseModel.create({
      courseName,
      courseDescription,
      coursePrice,
      courseThumb,
      category,
      instructor,
      status: "DRAFT",
    });

    return course;
  };

  static async updateCourse(courseId, payload) {
    const course = await courseModel.findById(convertObjectId(courseId));
    if (!course) {
      throw new NotFoundError("Course not found");
    }

    Object.keys(payload).forEach((key) => {
      const value = payload[key];
      if (value !== undefined && value !== null) {
        course[key] = value;
      }
    });

    await course.save();

    const courseSlug = course.slug;
    await redisClient.del(`course_detail::${courseSlug}`);

    return course;
  }

  static softDeleteCourse = async (courseId, instructorId) => {
    const course = await courseModel.findOne({
      _id: convertObjectId(courseId),
      instructor: convertObjectId(instructorId),
    });

    if (!course) {
      throw new NotFoundError("Course not found or permission denied");
    }

    course.status = CourseStatus.DELETED;
    await course.save();

    // Clear Redis cache
    await redisClient.del(`course_detail::${course.slug}`);

    return {
      courseId: course._id,
      status: course.status,
    };
  };

  static softDeleteCourseByAdmin = async (courseId) => {
    const course = await courseModel.findOne({
      _id: convertObjectId(courseId),
    });

    if (!course) {
      throw new NotFoundError("Course not found or permission denied");
    }

    course.status = CourseStatus.DELETED;
    await course.save();

    // Clear Redis cache
    await redisClient.del(`course_detail::${course.slug}`);

    return {
      courseId: course._id,
      status: course.status,
    };
  };

  static draftCourse = async (courseId, instructorId) => {
    const course = await courseModel.findOne({
      _id: convertObjectId(courseId),
      instructor: convertObjectId(instructorId),
    });

    if (!course) {
      throw new NotFoundError("Course not found or permission denied");
    }

    course.status = CourseStatus.DRAFT;
    await course.save();

    // Clear Redis cache
    await redisClient.del(`course_detail::${course.slug}`);

    return {
      courseId: course._id,
      status: course.status,
    };
  };

  static requestPublish = async (courseId, instructorId) => {
    const course = await courseModel.findOne({
      _id: convertObjectId(courseId),
      instructor: convertObjectId(instructorId),
    });

    if (!course) {
      throw new NotFoundError("Course not found or permission denied");
    }

    if (course.status !== CourseStatus.DRAFT) {
      throw new BadRequestError(
        "Only DRAFT courses can be submitted for review"
      );
    }

    course.status = CourseStatus.PENDING;
    await course.save();

    return {
      courseId: course._id,
      status: course.status,
    };
  };

  static getLessonsByCourse = async (courseId, instructorId) => {
    const course = await courseModel
      .findOne({
        _id: convertObjectId(courseId),
        instructor: convertObjectId(instructorId),
      })
      .lean();

    if (!course) {
      throw new NotFoundError("Course not found or access denied");
    }

    const lessons = await lessonModel
      .find({ course: courseId })
      .sort({ order: 1 });

    return lessons;
  };

  static getAllCoursesAdmin = async ({
    page,
    limit,
    query = "",
    status = "ALL",
  }) => {
    const filter = {};
    console.log(page, limit, query, status);

    if (query) {
      filter.courseName = { $regex: query, $options: "i" };
    }

    if (status && status !== "ALL") {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      courseModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category", "name slug")
        .populate("instructor", "username email")
        .lean(),
      courseModel.countDocuments(filter),
    ]);

    return formatPaginatedResponse({
      metadata: courses,
      page,
      limit,
      total,
    });
  };

  static getCourseDetailByAdmin = async (id) => {
    const course = await courseModel
      .findById(id)
      .populate("category", "name slug")
      .populate("instructor", "username email role")
      .populate("lessons", "lessonTitle videoUrl isPreview")
      .lean();

    if (!course) {
      throw new NotFoundError("Course not found");
    }
    return course;
  };

  static getCourseDetailByInstructor = async (courseId, userId) => {
    const course = await courseModel
      .findById(courseId)
      .populate("category", "name slug")
      .populate("instructor", "username email")
      .lean();

    if (!course) throw new NotFoundError("Course not found");

    const lessons = await lessonModel
      .find({ course: courseId })
      .sort({ order: 1 })
      .lean();

    const enrolledCount = await enrollmentModel.countDocuments({
      course: convertObjectId(courseId),
    });

    return {
      course,
      lessons,
      enrolledCount,
    };
  };

  static approveCourse = async (id) => {
    const course = await courseModel.findById(id);
    if (!course) throw new NotFoundError("Course not found");

    course.status = CourseStatus.PUBLISHED;
    await redisClient.del(REDIS_KEY.getCourseDetailBySlug(course.slug));
    await course.save();
  };

  static rejectCourse = async (id, feedback) => {
    const course = await courseModel.findById(id);
    if (!course) throw new NotFoundError("Course not found");

    course.status = CourseStatus.REJECTED;
    course.feedback = feedback || "Rejected by admin";
    await redisClient.del(REDIS_KEY.getCourseDetailBySlug(course.slug));
    await course.save();
  };
}

module.exports = CourseService;
