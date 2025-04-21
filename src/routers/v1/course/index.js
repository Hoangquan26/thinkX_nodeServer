const express = require('express');
const router = express.Router();

// Utils & Middlewares
const asyncHandle = require('../../../helpers/asyncHandle');
const { authUserMiddleware, authRoleMiddleware } = require('../../../middlewares/authUser');
const CourseController = require('../../../controllers/course.controller.js');
const UserRole = require('../../../common/constants/userRole');
const validateRequest = require('../../../middlewares/validator.js');
const {
  createCourseSchema,
  updateCourseSchema
} = require('../../../validations/toast.validation.js')

// ------------------------------------------
// 📌 Public API 
// ------------------------------------------

/**
 * @route   GET /v1/courses/public
 * @desc    Get all public courses (for homepage, explore, search, etc.)
 */
router.get('/public', asyncHandle(CourseController.getAllCoursesPublic));

/**
 * @route   GET /v1/courses/public-by-category/:slug
 * @desc    Get courses in a category (public)
 */
router.get('/public-by-category/:slug', asyncHandle(CourseController.getCoursesByCategorySlug));

/**
 * @route   GET /v1/courses/:slug
 * @desc    Get course detail by slug
 */
router.get('/:slug', asyncHandle(CourseController.getCourseBySlug));

/**
 * @route   GET /v1/courses/:id/lessons
 * @desc    Get lessons of a course
 */
router.get('/:id/lessons', asyncHandle(CourseController.getCourseLessons));

// ------------------------------------------
// 🔒 Instructor API (Authenticated)
// ------------------------------------------

router.use(authUserMiddleware);
router.use(authRoleMiddleware([UserRole.INSTRUCTOR, UserRole.ADMIN]));



/**
 * @route   GET /v1/courses/instructor/courses/me
 * @desc    Get courses of current instructor
 */
router.get('/instructor/courses/me', asyncHandle(CourseController.getCoursesByInstructor));
router.get('/instructor/:id', asyncHandle(CourseController.getCourseDetailByInstructor));

/**
 * @route   POST /v1/courses
 * @desc    Create new course
 */
router.post('/', validateRequest(createCourseSchema), asyncHandle(CourseController.createCourse));

/**
 * @route   PATCH /v1/courses/:id
 * @desc    Update course
 */
router.patch('/:id', validateRequest(updateCourseSchema), asyncHandle(CourseController.updateCourse));
router.patch('/draft/:id', validateRequest(updateCourseSchema), asyncHandle(CourseController.draftCourse));
/**
 * @route   DELETE /v1/courses/:id
 * @desc    Hide (soft delete) course
 */
router.delete('/:id', asyncHandle(CourseController.deleteCourse));

/**
 * @route   POST /v1/courses/:id/publish
 * @desc    Publish a course
 */
router.post('/:id/publish', asyncHandle(CourseController.publishCourse));

// ------------------------------------------
// 🔐 Admin API
// ------------------------------------------

router.use('/admin', authRoleMiddleware([UserRole.ADMIN]));

/**
 * @route   GET /v1/courses/admin
 * @desc    Admin get all courses
 */
router.get('/admin/all', asyncHandle(CourseController.getAllCoursesByAdmin));

/**
 * @route   GET /v1/courses/admin/:id
 * @desc    Admin get course by ID
 */
router.get('/admin/:id', asyncHandle(CourseController.getCourseDetailByAdmin));

router.delete('/admin/:id', asyncHandle(CourseController.softDeleteCourseByAdmin));

/**
 * @route   PATCH /v1/courses/admin/:id/approve
 * @desc    Admin approve course
 */
router.patch('/admin/:id/approve', asyncHandle(CourseController.approveCourse));

/**
 * @route   PATCH /v1/courses/admin/:id/reject
 * @desc    Admin reject course
 */
router.patch('/admin/:id/reject', asyncHandle(CourseController.rejectCourse));

module.exports = router;
