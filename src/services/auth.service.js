//import lib
const { uuid } = require('uuidv4') 

//require repo
const { findUserByEmailLean, createDefaultUser, findUserByIdLean } = require("../models/repos/user.repo")

//require util
const { hashBcryptSync, compareBcryptSync } = require('../providers/bcrypt.provider')
const { getInstanceData } = require("../providers/lodash.provider")
const { BadRequestError, ForbiddenError, UnauthorizedError } = require('../common/responses/errorReponse')
const { signJWTPair, decodeJWT, signJWT } = require('../providers/jwt.provider')
const { sendVerifyMail } = require('../providers/mail.provider')

//require constant
const { ACCESS_CONSTANT } = require("../common/constants/access.constant")

//load config
const configs = require('../configs/app.config')
const PRIVATE_KEY = configs.PRIVATE_KEY
const PUBLIC_KEY = configs.PUBLIC_KEY

class AuthService {
    static register = async({email, password}) => {
        const foundUser = await findUserByEmailLean(email)
        if(foundUser) throw new BadRequestError('Email was registered!')
        const username = email.split('@')[0]

        const hashedPassword = hashBcryptSync(password)
        const newUser = await createDefaultUser({ email, hashedPassword, username, verifyToken: uuid() })
        if(!newUser) throw new ForbiddenError('Something was wrong!')
        const payload = getInstanceData({object: newUser, key: ACCESS_CONSTANT.RESPONSE.REGISTER})

        //send mail
        sendVerifyMail({
            repicientEmail: newUser.email,
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
        
        const payload = getInstanceData({object: foundUser, key: ACCESS_CONSTANT.PAYLOAD})
        const tokens = signJWTPair({payload, privateKey: PRIVATE_KEY})

        return {
            tokens,
            user: getInstanceData({object: foundUser, key: ACCESS_CONSTANT.RESPONSE.LOGIN})
        }
    }

    static refreshToken = async({refreshToken}) => {
        const decodeUser = decodeJWT({token: refreshToken, publicKey: PUBLIC_KEY})
        if (decodeUser.status === 'error') {
            throw new UnauthorizedError('Please login again')
        }

        const {_id: userId } = decodeUser 
        const foundUser = await findUserByIdLean(userId)
        if(!foundUser) throw new UnauthorizedError('Please login again')

        const payload = getInstanceData({object: foundUser, key: ACCESS_CONSTANT.PAYLOAD})
        const accessToken = signJWT({payload, privateKey: PRIVATE_KEY})
        return {
            tokens: {
                accessToken,
                refreshToken
            },
            user: getInstanceData({object: foundUser, key: ACCESS_CONSTANT.RESPONSE.LOGIN})
        }
    }

    static logout = async() => {
        
    }
}
module.exports = AuthService