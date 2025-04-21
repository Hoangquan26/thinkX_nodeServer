'use strict';

const { OKResponse } = require('../common/responses/successReponse');
const CheckoutService = require('../services/checkout.service');

class CheckoutController {
  static checkoutCart = async (req, res) => {
    const userId = req.user._id;
    const metadata = await CheckoutService.confirmCheckout(userId);

    new OKResponse({
      message: 'Checkout preview success',
      metadata,
    }).send(res);
  };
}

module.exports = CheckoutController;
