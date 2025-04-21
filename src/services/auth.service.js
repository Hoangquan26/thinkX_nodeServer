//import lib
const { v4: uuidv4 } = require('uuid'); 

//require repo
const { findUserByEmailLean, createDefaultUser, findUserByIdLean, findUserByEmail, updateUserPassword } = require("../models/repos/user.repo")

//require util
const { hashBcryptSync, compareBcryptSync } = require('../providers/bcrypt.provider')
const { getInstanceData } = require("../providers/lodash.provider")
const { BadRequestError, ForbiddenError, UnauthorizedError } = require('../common/responses/errorReponse')
const { signJWTPair, decodeJWT, signJWT } = require('../providers/jwt.provider')
const { sendVerifyMail } = require('../providers/nodemailer.provider')

//require constant
const REDIS_KEY = require('../common/constants/redis.contant')
const { ACCESS_CONSTANT } = require("../common/constants/access.constant")

//load config
const configs = require('../configs/app.config');
const redisClient = require('../providers/redis.provider');
const PRIVATE_KEY = configs.PRIVATE_KEY
const PUBLIC_KEY = configs.PUBLIC_KEY

class AuthService {
    static register = async({email, password}) => {
        const foundUser = await findUserByEmailLean(email)
        if(foundUser) throw new BadRequestError('Email was registered!')
        const username = email.split('@')[0]

        const hashedPassword = hashBcryptSync(password)
        const newUser = await createDefaultUser({ email, hashedPassword, username, verifyToken: uuidv4() })
        if(!newUser) throw new ForbiddenError('Something was wrong!')
        const payload = getInstanceData({object: newUser, key: ACCESS_CONSTANT.RESPONSE.REGISTER})

        sendVerifyMail({
            recipientEmail: newUser.email,
            verifyToken: newUser.verifyToken
        })
        return {
            user: payload
        }
    }

    static login = async({email, password}) => {
        const foundUser = await findUserByEmailLean(email)
        if(!foundUser) throw new BadRequestError('User isn\'t exist !')

        const validPassword = compareBcryptSync(password, foundUser.hashedPassword)
        if(!validPassword) throw new BadRequestError('Wrong password')
        
        if (!foundUser.isActive) {
            throw new ForbiddenError("Pls check your email to verify your account");
        }

        const payload = getInstanceData({object: foundUser, key: ACCESS_CONSTANT.PAYLOAD})
        const tokens = signJWTPair({payload, privateKey: PRIVATE_KEY})
        redisClient.set(REDIS_KEY.getRefreshToken(foundUser._id.toString()), tokens.refreshToken, {EX: REDIS_KEY.REFRESHTOKEN_EX})

        return {
            tokens,
            user: getInstanceData({object: foundUser, key: ACCESS_CONSTANT.RESPONSE.LOGIN})
        }
    }

    static refreshToken = async({refreshToken}) => {
        const decodeUser = decodeJWT({token: refreshToken, publicKey: PUBLIC_KEY})
        console.log(refreshToken)
        if (decodeUser.status === 'error') {
            throw new UnauthorizedError('Please login again')
        }

        const {_id: userId } = decodeUser 
        const foundUser = await findUserByIdLean(userId)
        if(!foundUser) throw new UnauthorizedError('Please login again')

        const payload = getInstanceData({object: foundUser, key: ACCESS_CONSTANT.PAYLOAD})
        const tokens = signJWTPair({payload, privateKey: PRIVATE_KEY})

        redisClient.set(REDIS_KEY.getRefreshToken(foundUser._id.toString()), tokens.refreshToken, {EX: REDIS_KEY.REFRESHTOKEN_EX})

        return {
            tokens,
            user: getInstanceData({object: foundUser, key: ACCESS_CONSTANT.RESPONSE.LOGIN})
        }
    }

    static verifyToken = async({email, verifyToken}) => {
        const existUser = await findUserByEmail(email)
        if(!existUser) throw new BadRequestError('User isn\'t exist !')
        if(existUser.isActive) throw new BadRequestError('User was activated !')
        if(existUser.verifyToken !== verifyToken) throw new BadRequestError('Verify token is invalid !')

        const updateData = {
            isActive: true,
            verifyToken: null
        }

        existUser.isActive = true
        existUser.verifyToken = null
        const updatedUser = await existUser.save()
        if(!updatedUser) throw new BadRequestError('Something was wrong !')
        const payload = getInstanceData({object: updatedUser, key: ACCESS_CONSTANT.RESPONSE.LOGIN})
        return {
            user: payload
        }
    }

    static logout = async({userId}) => {
        redisClient.del(REDIS_KEY.getRefreshToken(userId))
    }

    static changeUserPassword = async(userId,  oldPassword, newPassword) => {
        const user = await findUserById(userId);
      
        if (!user) throw new BadRequestError("User not exist");
      
        const validOld = compareBcryptSync(oldPassword, user.hashedPassword);
        if (!validOld) throw new BadRequestError("Old password is not correct");
      
        const hashed = hashBcryptSync(newPassword);
        await updateUserPassword(userId, hashed);
      
        await redis.del(REDIS_KEY.getUserDetail(userId));
        return true;
    };
}
module.exports = AuthService