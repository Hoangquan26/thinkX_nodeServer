'use strict';

const enrollmentModel = require('../models/courseEnroll.model');
const courseModel = require('../models/course.model');
const userModel = require('../models/user.model');
const { NotFoundError, BadRequestError } = require('../common/responses/errorReponse');
const { convertObjectId } = require('../utils/mongo');
const { formatPaginatedResponse } = require('../helpers/responseFormat');


class EnrollmentService {

  static async getMyEnrolledCourses(userId) {
    const enrollments = await enrollmentModel.find({ user: convertObjectId(userId) })
      .populate({
        path: 'course',
        match: { status: CourseStatus.PUBLISHED },
        populate: {
          path: 'instructor category',
          select: 'username name slug'
        }
      })
      .lean();
  
    // Lọc bỏ enrollment không có course (nếu course bị xóa)
    const courses = enrollments
      .filter((enroll) => enroll.course)
      .map((enroll) => enroll.course);
  
    return courses;
  }
  
  static enrollInCourse = async ({ userId, courseId }) => {
    const course = await courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const existing = await enrollmentModel.findOne({ user: userId, course: courseId });
    if (existing) {
      throw new BadRequestError('You have already enrolled in this course');
    }

    const newEnrollment = await enrollmentModel.create({
      user: convertObjectId(userId),
      course: convertObjectId(courseId),
    });

    // Optionally: update courseStudentCount
    await courseModel.findByIdAndUpdate(courseId, {
      $inc: { courseStudentCount: 1 },
    });

    return newEnrollment;
  };

  static checkEnrolled = async({ userId, courseId }) => {
    const exist = await enrollmentModel.exists({
      user: userId,
      course: courseId,
    });
    if(exist) return {
      enrolled: true
    };  
    return {
      enrolled: false
    }
  }


  static getMyEnrollments = async (userId) => {
    const enrollments = await enrollmentModel
      .find({ user: convertObjectId(userId) })
      .populate({
        path: 'course',
        select: 'courseName slug courseThumb coursePrice courseRating category',
        populate: { path: 'category', select: 'name slug' },
      })
      .lean();

    return enrollments;
  };

  static getStudentsOfCourse = async (courseId) => {
    const course = await courseModel.findById(convertObjectId(courseId));
    if (!course) throw new NotFoundError('Course not found');

    const students = await enrollmentModel
      .find({ course: courseId })
      .populate('user', 'username email')
      .lean();

    return students;
  };

  static getAllEnrollments = async ({ page = 1, limit = 10, query = "" }) => {
    const skip = (page - 1) * limit;
    let filter = {};

    if (query) {
      const users = await userModel.find({
        $or: [
          { email: { $regex: query, $options: 'i' } },
          { username: { $regex: query, $options: 'i' } }
        ]
      }).select('_id');

      filter.user = { $in: users.map(u => u._id) };
    }

    const [data, total] = await Promise.all([
      enrollmentModel.find(filter)
        .populate('user', 'username email')
        .populate('course', 'courseName slug')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      enrollmentModel.countDocuments(filter)
    ]);

    return formatPaginatedResponse({ metadata: data, page, limit, total });
  };
}

module.exports = EnrollmentService;
