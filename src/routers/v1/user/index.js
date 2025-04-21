const express = require('express')
const router = express.Router()

//initial util
const asyncHandle = require('../../../helpers/asyncHandle')
//inital controller
const { authUserMiddleware, authRoleMiddleware } = require('../../../middlewares/authUser');
const UserController = require('../../../controllers/user.controller');
const UserRole = require('../../../common/constants/userRole');

router.use('/', authUserMiddleware)
router.get('/profile', asyncHandle(UserController.getProfile));

router.use('/', authRoleMiddleware(UserRole.ADMIN))
router.get("/", asyncHandle(UserController.getAllUsers));
router.get('/:id', asyncHandle(UserController.getUserById));
router.patch('/:id', asyncHandle(UserController.updateUserById));
router.patch("/:id/status", UserController.toggleUserStatus);

//auth user middleware
module.exports = router