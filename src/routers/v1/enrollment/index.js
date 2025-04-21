const express = require('express')
const router = express.Router()
const asyncHandle = require('../../../helpers/asyncHandle')
const { authUserMiddleware, authRoleMiddleware } = require('../../../middlewares/authUser')
const EnrollmentController = require('../../../controllers/enrollment.controller.js')
const UserRole = require('../../../common/constants/userRole')

// 🔒 Học viên đăng ký khóa học
router.use(authUserMiddleware)
router.get('/my-courses', asyncHandle(EnrollmentController.getMyCourses));

router.post('/:courseId', asyncHandle(EnrollmentController.enrollInCourse))
router.get('/my', asyncHandle(EnrollmentController.getMyEnrollments))

router.get('/check/:courseId', asyncHandle(EnrollmentController.checkEnrolled));

// 👨‍🏫 Giảng viên xem danh sách học viên trong khóa học của mình
router.use('/course', authRoleMiddleware([UserRole.ADMIN, UserRole.INSTRUCTOR]))
router.get('/course/:courseId', asyncHandle(EnrollmentController.getStudentsOfCourse))

// 🔐 Quản trị
router.use('/admin', authRoleMiddleware(UserRole.ADMIN))
router.get('/admin', asyncHandle(EnrollmentController.getAllEnrollments))

module.exports = router
