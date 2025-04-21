'use strict'
const { CREATEDResponse, OKResponse } = require("../common/responses/successReponse");
const CourseService = require("../services/course.service");

class CourseController {
    static getAllCoursesPublic = async (req, res, next)  => {
        const { page = 1, limit = 10, query = "", sortField = "createAt", sortOrder = -1} = req.query;

        const metadata = await CourseService.getAllCoursesPublic( { page , limit, query , sortField, sortOrder: Number(sortOrder) });
        new OKResponse({
            message: 'Get all courses successfully',
            metadata
        }).send(res)
    }

    static getCourseBySlug = async(req, res, next) => {
        const { slug } = req.params;
        const metadata = await CourseService.getCourseBySlug(slug);
        new OKResponse({
            message: 'Get course successfully',
            metadata
        }).send(res)
    }

    static getCoursesByCategorySlug = async(req, res, next) => {
        const { slug } = req.params;
        const result = await CourseService.getCoursesByCategorySlug(slug);
        new OKResponse({
            message: 'Get courses by category successfully',
            metadata: result
        }).send(res)
    }

    static getCoursesByInstructor = async(req, res, next) => {
        const instructorId = req.user._id;
        const courses = await CourseService.getCoursesByInstructor(instructorId);
        new OKResponse({
            message: 'Get instructor courses successfully',
            metadata: courses
        }).send(res)
    }

    static createCourse = async(req, res, next) => {
        const instructorId = req.user._id;
        const newCourse = await CourseService.createCourse({ ...req.body, instructor: instructorId });
        new CREATEDResponse({
            message: 'Create course successfully',
            metadata: newCourse
        }).send(res)
    }

    static updateCourse = async(req, res, next) => {
        const { id } = req.params;
        const payload = req.body;

        const updated = await CourseService.updateCourse(id, payload);
        new OKResponse({
            message: 'Update course successfully',
            metadata: updated
        }).send(res)
    }

    static deleteCourse = async(req, res, next) => {
        const { id } = req.params;
        const userId = req.user._id;
        const result = await CourseService.softDeleteCourse(id, userId);

        new OKResponse({
            message: 'Delete course successfully',
            metadata: result
        }).send(res)
    } 

    static softDeleteCourseByAdmin = async(req, res, next) => {
        const { id } = req.params;
        const result = await CourseService.softDeleteCourseByAdmin(id);

        new OKResponse({
            message: 'Delete course successfully',
            metadata: result
        }).send(res)
    } 

    static draftCourse = async(req, res, next) => {
        const { id } = req.params;
        const userId = req.user._id;
        const result = await CourseService.draftCourse(id, userId);

        new OKResponse({
            message: 'Draft course successfully',
            metadata: result
        }).send(res)
    }
 
    static publishCourse = async(req, res, next) => {
        const { id } = req.params;
        const instructorId = req.user._id;

        const result = await CourseService.requestPublish(id, instructorId);
        new OKResponse({
            message: 'Publish course successfully',
            metadata: result
        }).send(res)
    }

    static getCourseLessons = async(req, res, next) => {
        const courseId = req.params.id;
        const userId = req.user._id;

        const lessons = await CourseService.getLessonsByCourse(courseId, userId);
        new OKResponse({
            message: 'Get lessons successfully',
            metadata: lessons
        }).send(res)
    }

    static getAllCoursesByAdmin = async(req, res, next) => {
        const { page = 1, limit = 10, query = "", status } = req.query;
        const metadata = await CourseService.getAllCoursesAdmin({
            page: Number(page),
            limit: Number(limit),
            query,
            status
        });

        new OKResponse({
            message: 'Get all courses by admin successfully',
            metadata
        }).send(res)
    }

    static getCourseDetailByAdmin = async(req, res, next) => {
        const { id } = req.params;
        const metadata = await CourseService.getCourseDetailByAdmin(id);
        new OKResponse({
            message: 'Get course detail successfully',
            metadata
        }).send(res)
    }

    static getCourseDetailByInstructor = async(req, res, next) => {
        const { id } = req.params;
        const {_id: userId} = req.user
        const metadata = await CourseService.getCourseDetailByInstructor(id, userId);
        new OKResponse({
            message: 'Get course detail successfully',
            metadata
        }).send(res)
    }

    static approveCourse = async (req, res) => {
        const { id } = req.params;
        const metadata = await CourseService.approveCourse(id);
        new OKResponse({
            message: 'Approve course successfully',
            metadata
        }).send(res)
    };
    
    static rejectCourse = async (req, res) => {
        const { id } = req.params;
        const { feedback } = req.body;
        const metadata = await CourseService.rejectCourse(id, feedback);
        new OKResponse({
            message: 'Reject course successfully',
            metadata
        }).send(res)
    };
}

module.exports = CourseController;
