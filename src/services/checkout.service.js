const CartService = require('./cart.service');
const EnrollmentService = require('./enrollment.service');
const courseModel = require('../models/course.model');
const cartModel = require('../models/cart.model');
const { NotFoundError } = require('../common/responses/errorReponse');

class CheckoutService {
  static async confirmCheckout(userId) {
    const cartDetail = await CartService.getCartDetail(userId);

    if (!cartDetail || cartDetail.totalItems === 0) {
      throw new NotFoundError('Your cart is empty');
    }

    const courseIds = cartDetail.cartItems.map(item => item._id);

    await Promise.all(courseIds.map(courseId =>
      EnrollmentService.enrollInCourse({ userId, courseId })
    ));

    await courseModel.updateMany(
      { _id: { $in: courseIds } },
      { $inc: { courseStudentCount: 1 } }
    );

    await cartModel.findOneAndDelete({ user: userId });

    return {
      enrolledCourses: courseIds.length,
      totalPrice: cartDetail.totalPrice,
    };
  }
}

module.exports = CheckoutService;
