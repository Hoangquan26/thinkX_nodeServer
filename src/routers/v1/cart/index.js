const express = require('express');
const router = express.Router();

const CartController = require('../../../controllers/cart.controller.js');
const asyncHandle = require('../../../helpers/asyncHandle');
const { authUserMiddleware } = require('../../../middlewares/authUser');

// 📌 Áp dụng middleware xác thực người dùng
router.use(authUserMiddleware);

/**
 * @route   GET /v1/carts
 * @desc    Lấy giỏ hàng hiện tại của người dùng
 */
router.get('/', asyncHandle(CartController.getMyCart));
router.get("/amount", asyncHandle(CartController.getCartDetail));
/**
 * @route   POST /v1/carts
 * @desc    Cập nhật giỏ hàng của người dùng (thêm/xóa/sửa items)
 */
router.post('/', asyncHandle(CartController.updateMyCart));

router.post('/addToCart', asyncHandle(CartController.addToCart));


/**
 * @route   DELETE /v1/carts/:courseId
 * @desc    Xóa 1 khóa học khỏi giỏ hàng
 */
router.delete('/:courseId', asyncHandle(CartController.removeCourseFromCart));

module.exports = router;
