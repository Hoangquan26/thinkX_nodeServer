const { InstructorRequestStatus } = require('../common/constants/documentStatus');
const REDIS_KEY = require('../common/constants/redis.contant');
const UserRole = require('../common/constants/userRole');
const { BadRequestError } = require('../common/responses/errorReponse');
const { createRequest, findByUserIdLean, getRequestsPaginated, updateStatus, findByIdLean } = require('../models/repos/instructorRequest.repo');
const { updateUserById } = require('../models/repos/user.repo');
const redisClient = require('../providers/redis.provider');

class InstructorRequestService {
    static createRequest = async({description, userId}) => {
        const existing = await findByUserIdLean(userId);
       
        const newRequest = await createRequest({
            userId,
            description
        });
        return newRequest;
    }

    static getAllRequests = async({
        status,
        page,
        limit,
        query
    }) => {
        const result = await getRequestsPaginated({
            status,
            page,
            limit,
            query
          });
        
        return result;
    }

    static getMyRequest = async(userId) => {
        const cacheKey = REDIS_KEY.getRequestMyKey(userId);

        // Kiểm tra Redis trước
        const cached = await redisClient.get(cacheKey);
        if (cached) return JSON.parse(cached);

        const request = await findByUserIdLean(userId);
        if (!request) return null;

        await redisClient.set(cacheKey, JSON.stringify(request), {
            EX: REDIS_KEY.INSTRUCTOR_REQUEST_MY_EX
        });
        
        return request;
    }

    static approveRequest = async(requestId) => {
        const foundRequest = await findByIdLean(requestId);
        console.log(foundRequest)
        if (!foundRequest) throw new BadRequestError("Not found request");
        if (foundRequest.status !== InstructorRequestStatus.PENDING)
        throw new BadRequestError("Request was already processed");

     
        const updateUser = await updateUserById(foundRequest.userId, {
            role: UserRole.INSTRUCTOR
        });
        if(!updateUser) throw new BadRequestError('Some thing wrong')

        const updatedRequest = await updateStatus(requestId, {
            status: InstructorRequestStatus.APPROVED
        });
    
        await redisClient.del([
            REDIS_KEY.getRequestDetailKey(requestId),
            REDIS_KEY.getRequestMyKey(foundRequest.userId),
            REDIS_KEY.getUserDetail(foundRequest.userId)
          ]);

        return updatedRequest;
    }
    static rejectRequest = async(requestId, feedback) => {
        const foundRequest = await findByIdLean(requestId);
        if (!foundRequest) throw new BadRequestError("Not found request");
        if (foundRequest.status !== InstructorRequestStatus.PENDING)
        throw new BadRequestError("Request was already processed");

        const updatedRequest = await updateStatus(requestId, {
            status: InstructorRequestStatus.REJECTED,
            feedback: feedback || "Request was rejected"
        });

        await redisClient.del([
            REDIS_KEY.getRequestDetailKey(requestId),
            REDIS_KEY.getRequestMyKey(foundRequest.userId)
        ]);

        return updatedRequest;
    }
}

module.exports = InstructorRequestService