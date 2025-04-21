'use strict';

const { CREATEDResponse, OKResponse } = require("../common/responses/successReponse");
const LessonService = require("../services/lesson.service.js");

class LessonController {
  /**
   * @route   POST /v1/lessons
   * @desc    Instructor creates a new lesson
   */
  static createLesson = async (req, res) => {
    const instructorId = req.user._id;
    const payload = req.body;

    const metadata = await LessonService.createLesson({ ...payload, instructor: instructorId });
    new CREATEDResponse({
      message: 'Lesson created successfully',
      metadata
    }).send(res);
  };

  static getPublicLessons = async (req, res) => {
    const {courseId} = req.params;

    const metadata = await LessonService.getPublicLessons(courseId);
    new CREATEDResponse({
      message: 'Lesson created successfully',
      metadata
    }).send(res);
  }

  static getLearningLessons = async (req, res) => {
    console.log(req.user)
    const {courseId} = req.params;
    const userId = req.user._id;
    const metadata = await LessonService.getLearningLessons(userId, courseId);
    new CREATEDResponse({
      message: 'Lesson created successfully',
      metadata
    }).send(res);
  }
  /**
   * @route   PATCH /v1/lessons/:id
   * @desc    Instructor updates an existing lesson
   */
  static updateLesson = async (req, res) => {
    const { id } = req.params;
    const payload = req.body;

    const metadata = await LessonService.updateLesson(id, payload);
    new OKResponse({
      message: 'Lesson updated successfully',
      metadata
    }).send(res);
  };

  /**
   * @route   DELETE /v1/lessons/:id
   * @desc    Instructor deletes a lesson
   */
  static forceDeleteLesson = async (req, res) => {
    const { id } = req.params;
    const instructorId = req.user._id;
    const metadata = await LessonService.deleteLesson(id, instructorId);
    new OKResponse({
      message: 'Lesson deleted successfully',
      metadata
    }).send(res);
  };

  /**
   * @route   GET /v1/lessons/:id
   * @desc    Get detail of a lesson
   */
  static getLessonById = async (req, res) => {
    const { id } = req.params;

    const metadata = await LessonService.getLessonById(id);
    new OKResponse({
      message: 'Lesson detail fetched successfully',
      metadata
    }).send(res);
  };

  /**
   * @route   GET /v1/lessons/by-course/:courseId
   * @desc    Get all lessons of a course (instructor or enrolled student)
   */
  static getLessonsByCourseId = async (req, res, next) => {
    const { courseId } = req.params;
    const userId = req.user._id;

    const metadata = await LessonService.getLessonsByCourse(courseId, userId);
    new OKResponse({
      message: 'Get lessons by course success',
      metadata
    }).send(res);
  };

  /**
   * @route   GET /v1/admin/lessons
   * @desc    Admin get all lessons with filters
   */
  static getAllLessonsForAdmin = async (req, res, next) => {
    const { page = 1, limit = 10, query = "", courseId } = req.query;

    const metadata = await LessonService.getAllLessonsForAdmin({
      page: Number(page),
      limit: Number(limit),
      query,
      courseId,
    });

    new OKResponse({
      message: 'Admin get all lessons success',
      metadata,
    }).send(res);
  };

  /**
   * @route   DELETE /v1/admin/lessons/:id
   * @desc    Admin force deletes a lesson
   */
  static forceDelete = async (req, res, next) => {
    const { id } = req.params;
    const metadata = await LessonService.forceDeleteLesson(id);

    new OKResponse({
      message: 'Lesson permanently deleted',
      metadata,
    }).send(res);
  };

  static getAllMyLessons = async (req, res) => {
    const instructorId = req.user._id;

    console.log(instructorId)
    const metadata = await LessonService.getAllMyLessons(instructorId);
  
    new OKResponse({
      message: 'Fetched your lessons successfully',
      metadata,
    }).send(res);
  };
  
}

module.exports = LessonController;
