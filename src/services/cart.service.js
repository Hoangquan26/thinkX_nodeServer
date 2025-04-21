'use strict';

const cartModel = require('../models/cart.model');
const courseModel = require('../models/course.model');
const { NotFoundError, BadRequestError } = require('../common/responses/errorReponse');
const { convertObjectId } = require('../utils/mongo');
const { CourseStatus } = require('../common/constants/courseStatus');

class CartService {
    static getMyCart = async (userId) => {
        const cart = await cartModel.findOne({ user: convertObjectId(userId) })
        .populate('courses', 'courseName coursePrice courseThumb slug')
        .lean();

        return cart || { user: userId, courses: [] };
    };

    static updateMyCart = async (userId, courseIds = []) => {
        const validCourses = await courseModel.find({
        _id: { $in: courseIds.map(convertObjectId) },
        }).select('_id');
    
        const validCourseIds = validCourses.map((c) => c._id.toString());
    
        const payload = {
        courses: validCourseIds
        };
    
        const filteredPayload = {};
        Object.keys(payload).forEach((key) => {
        if (payload[key] !== undefined && payload[key] !== null) {
            filteredPayload[key] = payload[key];
        }
        });
    
        const updatedCart = await cartModel.findOneAndUpdate(
        { user: convertObjectId(userId) },
        { $set: filteredPayload },
        { new: true, upsert: true }
        ).populate('courses', 'courseName coursePrice courseThumb slug');
    
        return updatedCart;
    };
    

    static removeCourseFromCart = async (userId, courseId) => {
        const updatedCart = await cartModel.findOneAndUpdate(
        { user: convertObjectId(userId) },
        { $pull: { courses: convertObjectId(courseId) } },
        { new: true }
        ).populate('courses', 'courseName coursePrice courseThumb slug');

        if (!updatedCart) {
        throw new NotFoundError('Cart not found');
        }

        return updatedCart;
    };

    static addCourseToCart = async (userId, courseId) => {
      const course = await courseModel.findById(convertObjectId(courseId));
    
      if (!course) {
        throw new NotFoundError("Course not found");
      }
    
      if (course.status !== CourseStatus.PUBLISHED) {
        throw new NotFoundError("Course is not published");
      }
    
      let cart = await cartModel.findOne({ user: convertObjectId(userId) });
    
      if (!cart) {
        cart = await cartModel.create({
          user: userId,
          courses: [courseId]
        });
      } else {
        const alreadyInCart = cart.courses.some(
          (c) => c.toString() === courseId.toString()
        );
    
        if (alreadyInCart) {
          throw new BadRequestError('Course already in cart');
        }
    
        cart.courses.push(courseId);
        await cart.save();
      }
    
      const populatedCart = await cart.populate(
        "courses",
        "courseName coursePrice courseThumb slug"
      );
    
      return populatedCart
    };
    

    static getCartDetail = async (userId) => {
        const cart = await cartModel.findOne({ user: convertObjectId(userId) }).lean();
    
        if (!cart || !cart.courses || cart.courses.length === 0) {
          return {
            cartItems: [],
            totalItems: 0,
            totalPrice: 0,
          };
        }
    
        const courses = await courseModel.find({
          _id: { $in: cart.courses }
        }).select("courseName coursePrice courseThumb slug").lean();
    
        const totalPrice = courses.reduce((acc, course) => acc + course.coursePrice, 0);
    
        return {
          cartItems: courses,
          totalItems: courses.length,
          totalPrice,
        };
      };
}

module.exports = CartService;
