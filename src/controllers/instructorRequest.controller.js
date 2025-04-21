'use strict'
const { CREATEDResponse, OKResponse } = require("../common/responses/successReponse");
const InstructorRequestService = require("../services/instructorRequest.service");

class InstructorRequestController {
    static sendRequest = async(req, res, next) => {
        const { description } = req.body;
        const userId = req.user._id;

        const response = await InstructorRequestService.createRequest({
            userId,
            description
        });

        new CREATEDResponse({
            message: 'Instructor request created successfully',
            metadata: response
        }).send(res)
    }

    static getAllRequests = async(req, res, next) => {
        const { page = 1, limit = 10, status, query } = req.query;
        const result = await InstructorRequestService.getAllRequests({
            page: parseInt(page),
            limit: parseInt(limit),
            status,
            query
        });

        new OKResponse({
            message: 'Get all instructor requests successfully',
            metadata: result,
        }).send(res)
    }

    static getMyRequest = async(req, res, next) => {
        const userId = req.user._id;
        const request = await InstructorRequestService.getMyRequest(userId);
        new OKResponse({
            message: 'Get my instructor request successfully',
            metadata: request,
        }).send(res)
    }

    static approveRequest = async(req, res, next) => {
        const { id } = req.params;
        const response = await InstructorRequestService.approveRequest(id);

        new OKResponse({
            message: 'Instructor request approved successfully',
            metadata: response
        }).send(res)
    }
    static rejectRequest = async(req, res, next) => {
        const { id } = req.params;
        const { feedback } = req.body;
        const response = await InstructorRequestService.rejectRequest(id, feedback);
        new OKResponse({
            message: 'Instructor request rejected',
            metadata: response
        }).send(res)
    }
}

module.exports = InstructorRequestController