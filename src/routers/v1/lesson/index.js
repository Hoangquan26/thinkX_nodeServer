const express = require("express");
const router = express.Router();
const asyncHandle = require("../../../helpers/asyncHandle");
const LessonController = require("../../../controllers/lesson.controller.js");
const { authUserMiddleware, authRoleMiddleware } = require("../../../middlewares/authUser");
const UserRole = require("../../../common/constants/userRole");

// ------------------- Public / Authenticated -------------------

// Nếu bạn cho phép học viên đã enroll xem bài học:
router.get("/:id", asyncHandle(LessonController.getLessonById));
router.get("/:courseId/all", asyncHandle(LessonController.getPublicLessons));

router.use("/learning", authUserMiddleware);
router.get("/learning/:courseId/all", asyncHandle(LessonController.getLearningLessons));
// ------------------- Instructor -------------------
router.use("/instructor", authUserMiddleware);
router.use("/instructor", authRoleMiddleware([UserRole.INSTRUCTOR, UserRole.ADMIN]));


router.get("/instructor/all", asyncHandle(LessonController.getAllMyLessons));
router.post("/instructor/lessons", asyncHandle(LessonController.createLesson));
router.get("/instructor/lessons/course/:courseId", asyncHandle(LessonController.getLessonsByCourseId));
router.patch("/instructor/lessons/:id", asyncHandle(LessonController.updateLesson));
router.delete("/instructor/lessons/:id", asyncHandle(LessonController.forceDelete));

// ------------------- Admin -------------------
router.use("/admin", authRoleMiddleware(UserRole.ADMIN));

router.get("/admin/lessons", asyncHandle(LessonController.getAllLessonsForAdmin));
router.delete("/admin/lessons/:id", asyncHandle(LessonController.forceDeleteLesson));

module.exports = router;
