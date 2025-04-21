const express = require('express');
const router = express.Router();

// Initial util
const asyncHandle = require('../../../helpers/asyncHandle');

// Initial controller
const { authUserMiddleware, authRoleMiddleware } = require('../../../middlewares/authUser');
const InstructorRequestController = require('../../../controllers/instructorRequest.controller');
const UserRole = require('../../../common/constants/userRole');

// Auth user middleware
router.use(authUserMiddleware);


router.get("/me", asyncHandle(InstructorRequestController.getMyRequest));

// Route to send instructor request
router.post('/', asyncHandle(InstructorRequestController.sendRequest));


router.use(authRoleMiddleware(UserRole.ADMIN))
router.patch("/:id/approve", asyncHandle(InstructorRequestController.approveRequest));
router.patch("/:id/reject", asyncHandle(InstructorRequestController.rejectRequest));
router.get("/", asyncHandle(InstructorRequestController.getAllRequests));


module.exports = router;