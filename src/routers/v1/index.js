const express = require('express')
const router = express.Router()

router.use('/auth', require('./auth'))
router.use('/user', require('./user'))
router.use('/instructorRequest', require('./instructorRequest'))
router.use('/courses', require('./course'))
router.use('/categories', require('./category'))
router.use('/carts', require('./cart'))
router.use('/checkout', require('./checkout'))
router.use('/lessons', require('./lesson'))
router.use('/enrollments', require('./enrollment'))
module.exports = router