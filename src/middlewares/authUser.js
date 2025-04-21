'use strict'
const HeaderConstant = require('../common/constants/header.constant')
const { decodeJWT } = require('../providers/jwt.provider')
const configs = require('../configs/app.config')
const { findUserByIdLean } = require('../models/repos/user.repo')
const { UnauthorizedError, GoneError } = require('../common/responses/errorReponse')
const PUBLIC_KEY = configs.PUBLIC_KEY

const authUserMiddleware = async(req, res, next) => {
    try {
        const accessToken = req.headers[HeaderConstant.AUTHORIZATION]
        if (!accessToken) {
            return next(new UnauthorizedError('Access token is missing'))
        }
    
        const decodeUser = decodeJWT({ token: accessToken, publicKey: PUBLIC_KEY })
        if (decodeUser.status === 'error') {
            if(decodeUser.message.includes('jwt expired')) return next(new GoneError())
            return next(new UnauthorizedError('Invalid access token'))
        }
        const { _id: userId } = decodeUser
        const foundUser = await findUserByIdLean(userId)
        if (!foundUser) {
            return next(new UnauthorizedError('User does not exist'))
        }
    
        req.user = {
            ...decodeUser,
            role: foundUser.role
        } 

        console.log(req.user, "---request user")
        return next()
    }
    catch(err) {
        return next(new Error(err.message))
    }
}

const authRoleMiddleware = (roles) => {
    return async(req, res, next) => {
        try {
            const user = req.user
            if (!user) {
                return next(new UnauthorizedError('User not found'))
            }
            const { role } = user
            console.log(role, roles)

            if (!roles.includes(role)) {
                return next(new UnauthorizedError('User does not have permission'))
            }
            return next()
        }
        catch(err) {
            return next(new Error(err.message))
        }
    }
}

module.exports = {
    authUserMiddleware,
    authRoleMiddleware
}