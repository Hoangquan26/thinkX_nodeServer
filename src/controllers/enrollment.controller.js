'use strict';

const { OKResponse, CREATEDResponse } = require('../common/responses/successReponse');
const EnrollmentService = require('../services/enrollment.service.js');

class EnrollmentController {
  /**
   * @route POST /v1/enrollments/:courseId
   * @desc Học viên đăng ký khóa học
   */

  static async getMyCourses(req, res) {
    const userId = req.user._id;
    const courses = await EnrollmentService.getMyEnrolledCourses(userId);
    new OKResponse({
      message: 'get my courses successfully',
      metadata: courses
    }).send(res);
  }
  
  static enrollInCourse = async (req, res) => {
    const userId = req.user._id;
    const courseId = req.params.courseId;

    const metadata = await EnrollmentService.enrollInCourse({ userId, courseId });

    new CREATEDResponse({
      message: 'Enrollment successful',
      metadata
    }).send(res);
  };

  static checkEnrolled = async (req, res) => {
    const userId = req.user._id;
    const courseId = req.params.courseId;

    const metadata = await EnrollmentService.checkEnrolled({ userId, courseId });

    new CREATEDResponse({
      message: 'Enrollment successful',
      metadata
    }).send(res);
  }

  /**
   * @route GET /v1/enrollments/my
   * @desc Học viên xem danh sách các khóa học đã đăng ký
   */
  static getMyEnrollments = async (req, res) => {
    const userId = req.user._id;

    const metadata = await EnrollmentService.getMyEnrollments(userId);

    new OKResponse({
      message: 'Fetched my enrollments',
      metadata
    }).send(res);
  };

  /**
   * @route GET /v1/enrollments/course/:courseId
   * @desc Giảng viên xem danh sách học viên trong khóa học
   */
  static getStudentsOfCourse = async (req, res) => {
    const courseId = req.params.courseId;

    const metadata = await EnrollmentService.getStudentsOfCourse(courseId);

    new OKResponse({
      message: 'Fetched students of course',
      metadata
    }).send(res);
  };

  /**
   * @route GET /v1/admin/enrollments
   * @desc Admin xem toàn bộ danh sách đăng ký
   */
  static getAllEnrollments = async (req, res) => {
    const { page = 1, limit = 10, query = "" } = req.query;

    const metadata = await EnrollmentService.getAllEnrollments({
      page: Number(page),
      limit: Number(limit),
      query,
    });

    new OKResponse({
      message: 'Fetched all enrollments',
      metadata
    }).send(res);
  };
}

module.exports = EnrollmentController;
