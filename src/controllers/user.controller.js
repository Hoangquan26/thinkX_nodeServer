const { ConversationsAgentOnlinePingPostRequest } = require('@getbrevo/brevo');
const { BadRequestError } = require('../common/responses/errorReponse');
const { OKResponse } = require('../common/responses/successReponse')
const UserService = require('../services/user.service')
class UserController {
    static getAllUsers = async(req, res, next) => {
        // const { page = 1, limit = 10, role, status, isActive, keyword } = req.query;
        const { page = 1, limit = 10, role, query } = req.query;
        const result = await UserService.getAllUsers({
            page: parseInt(page),
            limit: parseInt(limit),
            role,
            query
        });

        new OKResponse({
            message: 'Get all users successfully',
            metadata: result
        }).send(res);
    }

    static getProfile = async(req, res, next) => {
        const userId = req.user._id
        const user = await UserService.getUserDetail(userId);
        new OKResponse({
            message: 'Get users successfully',
            metadata: user
        }).send(res);
    }
 
    static getUserById = async(req, res, next) => {
        const userId = req.params.id
        const user = await UserService.getUserDetail(userId);
        new OKResponse({
            message: 'Get users successfully',
            metadata: user
        }).send(res);
    }

    static updateUserById = async(req, res, next) => {
        const userId = req.params.id
        const { body } = req
        const user = await UserService.updateUserById(userId, body);
        new OKResponse({
            message: 'Update users successfully',
            metadata: user
        }).send(res);
    }

    static toggleUserStatus = async(req, res, next) => {
        const userId = req.params.id
        const { status  } = req.body

        if (!["ACTIVE", "INACTIVE"].includes(status)) {
            throw new BadRequestError("Invalid status"); 
        }
        const user = await UserService.updateUserStatus(userId, status);
        new OKResponse({
            message: `Update was ${status === "INACTIVE" ? 'ban' : 'unban'}`,
            metadata: user
        }).send(res);
    }
}

module.exports = UserController