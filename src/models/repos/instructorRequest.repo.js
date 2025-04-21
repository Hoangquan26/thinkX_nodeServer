const REDIS_KEY = require("../../common/constants/redis.contant");
const { formatPaginatedResponse } = require("../../helpers/responseFormat");
const { convertObjectId } = require("../../utils/mongo");
const InstructorRequestModel = require("../instructorRequest.model");
const redisClient = require('../../providers/redis.provider');
const instructorRequestModel = require("../instructorRequest.model");

const findByUserId = async (userId) => {
    userId = convertObjectId(userId);
    return await instructorRequestModel.findOne({ userId });
};

const findByUserIdLean = async (userId) => {
  userId = convertObjectId(userId);
  console.log(userId)
  return await instructorRequestModel.findOne({ userId }).lean();
};

const findById = async (id) => {
  id = convertObjectId(id);
  return await instructorRequestModel.findById(id);
};

const findByIdLean = async (id) => {
  id = convertObjectId(id);
return await instructorRequestModel.findById(id).lean();
};


const createRequest = async ({userId, description}) => {
  const doc = await InstructorRequestModel.create({userId, description});
  return doc;
};

const getRequestsPaginated = async ({ status , page = 1, limit = 10, query = "" }) => {
  const cacheKey = REDIS_KEY.getRequestListKey(page, limit, status, query);
  const cacheData = await redisClient.get(cacheKey);

  console.log(cacheKey)
  if(cacheData) { 
    return JSON.parse(cacheData);
  }

  const filter = {};
  if (status && status != "ALL") {
      filter.status = status;
  }
  const skip = (page - 1) * limit;

  const finalFilter = {
    ...filter
  };



  const [data, total] = await Promise.all([
    instructorRequestModel.find(finalFilter)
      .populate("userId", "username email role status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
      instructorRequestModel.countDocuments(finalFilter),
  ]);
  
  // Cache the data
  redisClient.set(cacheKey, JSON.stringify(data), {
    EX: REDIS_KEY.INSTRUCTOR_REQUEST_LIST_EX,
  });

  return formatPaginatedResponse({
    metadata: data,
    page: skip / limit + 1,
    limit,
    total
  });
}

const updateStatus = async (userId, updateData) => {
  userId = convertObjectId(userId);
  return await instructorRequestModel.findByIdAndUpdate(userId, updateData, {
    new: true
  }).populate("userId", "username email role").lean();
};

module.exports = {
  findByUserId,
  findByUserIdLean,
  createRequest,
  getRequestsPaginated,
  updateStatus,
  findById,
  findByIdLean
}
