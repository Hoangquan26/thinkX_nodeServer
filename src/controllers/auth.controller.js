const AuthService = require('../services/auth.service')
const asyncHandle = require('../helpers/asyncHandle')
const { OKResponse, CREATEDResponse, cookieConstructor, NO_CONTENTReponse } = require('../common/responses/successReponse') 
const HeaderConstant = require('../common/constants/header.constant')
class AuthController {
    static register = async(req, res, next) => {
        const {email, username, password} = req.body
        const metadata = await AuthService.register({email, password})
        new CREATEDResponse({
            message: 'Create account successful',
            metadata
        }).send(res)
    }
    
    static login = async(req, res, next) => {
        const {email, password} = req.body
        const metadata = await AuthService.login({email, password})
        
        new OKResponse({
            message: 'Login successful',
            metadata,
            cookies: {
                ...cookieConstructor({name: HeaderConstant.REFRESHTOKEN, value: metadata.tokens.refreshToken, options: {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, secure: true}}),
            }
        }).send(res)
    }

    static verifyAccounnt = async(req, res, next) => {
        const { email, token } = req.body
        console.log(email, token)
        const metadata = await AuthService.verifyToken({email, verifyToken: token})
        new OKResponse({
            message: 'Verify account successful',
            metadata
        }).send(res)
    }

    static refreshToken = async(req, res, next) => {
        console.log(req.cookies)
        const refreshToken = req.cookies[HeaderConstant.REFRESHTOKEN]
        const metadata = await AuthService.refreshToken({refreshToken})
        new CREATEDResponse({
            message: 'Refresh token successful',
            metadata,
            cookies: {
                ...cookieConstructor({name: HeaderConstant.REFRESHTOKEN, value: metadata.tokens.refreshToken, options: {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, secure: true}}),
            }
        }).send(res)
    }

    static logout = async(req, res, next) => {
        console.log('---logout')
        const userId = req.user.userId
        AuthService.logout({userId})
        new NO_CONTENTReponse({
            message: 'Logout successful',
            clearCookie: true
        }).send(res)
    } 

    static changePassword = async(req, res, next) => { 
        const userId = req.user._id;
        const { oldPassword, newPassword } = req.body;
        const result = await UserService.changeUserPassword(userId, oldPassword, newPassword)
        new OKResponse(res, {
            message: `Change password successfully`,
            metadata: result,
            clearCookie: true
        }).send();
    }
}
module.exports = AuthController