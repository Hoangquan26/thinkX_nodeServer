'use strict'
const REDIS_KEY = require('../common/constants/redis.contant')
const userModel = require('../models/user.model')
const redisClient = require('../providers/redis.provider')

const { formatPaginatedResponse } = require('../helpers/responseFormat')    
const { findUserByIdLean, updateUserById, findUserById } = require('../models/repos/user.repo')

class UserService {
    constructor (userRepository) {
        this.userRepository = userRepository
    }

    static getAllUsers = async ({page = 1, limit = 10, role = "all", query = ""}) => {
        const cacheKey = REDIS_KEY.getUserList(page, limit, role, query)
        
        const cachedData = await redisClient.get(cacheKey)
        if(cachedData) {
            return JSON.parse(cachedData)
        }

        const filter = {};
        if (role && role !== "all") filter.role = role;
        if (query) {
            filter.$or = [
              { email: { $regex: query, $options: "i" } },
              { username: { $regex: query, $options: "i" } }
            ];
        }
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            userModel.find(filter)
              .sort({ createdAt: -1 })
              .skip(skip)
              .limit(limit)
              .select("-hashedPassword -verifyToken"),
            userModel.countDocuments(filter),
        ]);

        
        const result = formatPaginatedResponse({metadata: users, page, limit, total})
        console.log(result, '-0----')

        await redisClient.set(cacheKey, JSON.stringify(result), { EX: REDIS_KEY.USER_LIST_EX}); 
        return result;
    }

    static getUserDetail = async(userId) => {
      const cacheKey = REDIS_KEY.getUserDetail(userId);

      const cached = await redisClient.get(cacheKey);
      if (cached) return JSON.parse(cached);

      const user = await findUserByIdLean(userId).select("-hashedPassword -verifyToken");
      if (!user) {
        throw new Error("User not found");
      }
      await redis.set(cacheKey, JSON.stringify(user), {
        EX: REDIS_KEY.USER_DETAIL_EX,
      });

      return user
    }

    static updateUserById = async(userId, data) => {
      const allowedFields = ["role", "status", "isActive", "username"];
      const updateData = {};
      allowedFields.forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          updateData[key] = data[key];
        }
      });
      if (Object.keys(updateData).length === 0) {
        throw new Error("Not have accepted field to update");
      }

      const updatedUser = await updateUserById(userId, updateData);

      await redisClient.del(REDIS_KEY.getUserDetail(userId));
      return updatedUser;
    }

    static updateUserStatus = async(userId, status) => {
      const updatedUser = await updateUserById(userId, { status: newStatus });
      await redis.del(REDIS_KEY.getUserDetail(userId));
    
      return updatedUser;
    }
}

module.exports = UserService