const express = require('express');
const router = express.Router();

const asyncHandle = require('../../../helpers/asyncHandle');
const { authUserMiddleware, authRoleMiddleware } = require('../../../middlewares/authUser');
const CheckoutController = require('../../../controllers/checkout.controller')
router.use('/', authUserMiddleware)
router.post('/', asyncHandle(CheckoutController.checkoutCart));


module.exports = router;
