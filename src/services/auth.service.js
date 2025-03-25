
//require repo
const { findUserByEmailLean, createDefaultUser } = require("../models/repos/user.repo")

//require util
const { hashBcryptSync, compareBcryptSync } = require('../providers/bcrypt.provider')
const { getInstanceData } = require("../providers/lodash.provider")
const { BadRequestError, ForbiddenError } = require('../common/responses/errorReponse')
const { signJWTPair } = require('../providers/jwt.provider')

//require constant
const { ACCESS_CONSTANT } = require("../common/constants/access.constant")

//load config
const configs = require('../configs/app.config')
const PRIVATE_KEY = configs.PRIVATE_KEY

class AuthService {
    static register = async({email, password, username}) => {
        const foundUser = await findUserByEmailLean(email)
        if(foundUser) throw new BadRequestError('Email was registered!')

        const hashedPassword = hashBcryptSync(password)
        const newUser = await createDefaultUser({ email, hashedPassword, username })
        if(!newUser) throw new ForbiddenError('Something was wrong!')

        const payload = getInstanceData({object: newUser, key: ACCESS_CONSTANT.RESPONSE.REGISTER})
        return {
            user: payload
        }
    }

    static login = async({email, password}) => {
        const foundUser = await findUserByEmailLean(email)
        if(!foundUser) throw new BadRequestError('User is not registered!')

        const validPassword = compareBcryptSync(password, foundUser.hashedPassword)
        if(!validPassword) throw new BadRequestError('Wrong password')
        
        const payload = getInstanceData({object: foundUser, key: ACCESS_CONSTANT.PAYLOAD})
        console.log(PRIVATE_KEY)
        const tokens = signJWTPair({payload, privateKey: PRIVATE_KEY})

        return {
            tokens,
            user: getInstanceData({object: foundUser, key: ACCESS_CONSTANT.RESPONSE.LOGIN})
        }
    }

    static refreshToken = async() => {

    }

    static logout = async() => {
        
    }
}
module.exports = AuthService