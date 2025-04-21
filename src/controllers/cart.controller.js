'use strict';

const { OKResponse, CREATEDResponse } = require('../common/responses/successReponse');
const CartService = require('../services/cart.service.js');

class CartController {
  /**
   * @route GET /v1/carts
   * @desc Lấy giỏ hàng hiện tại của người dùng
   */
    static getMyCart = async (req, res) => {
        const userId = req.user._id;
        const metadata = await CartService.getMyCart(userId);

        new OKResponse({
        message: 'Lấy giỏ hàng thành công',
        metadata
        }).send(res);
    };

  /**
   * @route POST /v1/carts
   * @desc Cập nhật giỏ hàng (thêm hoặc xóa các khóa học)
   */
    static updateMyCart = async (req, res) => {
        const userId = req.user._id;
        const { courseIds } = req.body; // mảng các _id khóa học

        const metadata = await CartService.updateMyCart(userId, courseIds);

        new OKResponse({
        message: 'Cập nhật giỏ hàng thành công',
        metadata
        }).send(res);
    };

  /**
   * @route DELETE /v1/carts/:courseId
   * @desc Xóa 1 khóa học khỏi giỏ hàng
   */
    static removeCourseFromCart = async (req, res) => {
        const userId = req.user._id;
        const courseId = req.params.courseId;

        const metadata = await CartService.removeCourseFromCart(userId, courseId);

        new OKResponse({
            message: 'Xóa khóa học khỏi giỏ hàng thành công',
            metadata
        }).send(res);
    };


    static addToCart = async (req, res) => {
        const userId = req.user._id;
        const { courseId } = req.body;
    
        const metadata = await CartService.addCourseToCart(userId, courseId);
    
        new OKResponse({
        message: 'Course added to cart',
        metadata
        }).send(res);
    };

    static getCartDetail = async (req, res) => {
        const userId = req.user._id;
    
        const metadata = await CartService.getCartDetail(userId);
    
        new OKResponse({
        message: 'Get cart detail success',
        metadata
        }).send(res);
    };

    // static addCourseToCart = async (req, res) => {
    //     const userId = req.user._id;
    //     const metadata = await CartService.addCourseToCart(userId);
    
    //     new OKResponse({
    //       message: 'Get cart detail success',
    //       metadata
    //     }).send(res);
    // };
}

module.exports = CartController;
