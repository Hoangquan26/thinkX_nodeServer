const express = require('express')
const router = express.Router()

//initial util
const asyncHandle = require('../../../helpers/asyncHandle')
//inital controller
const AuthValidation = require('../../../validations/auth.validation')
const AuthController = require('../../../controllers/auth.controller')

router.post('/register', AuthValidation.register, asyncHandle(AuthController.register))
router.post('/login', AuthValidation.login, asyncHandle(AuthController.login))
router.delete('/logout', asyncHandle(AuthController.logout))
router.post('/refresh', asyncHandle(AuthController.refreshToken))
module.exports = router