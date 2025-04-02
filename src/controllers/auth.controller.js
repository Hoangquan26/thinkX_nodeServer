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
                ...cookieConstructor({name: 'refreshToken', value: metadata.tokens.refreshToken, options: {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, secure: true}}),
            }
        }).send(res)
    }

    static refreshToken = async(req, res, next) => {
        const refreshToken = req.cookies[HeaderConstant.REFRESHTOKEN]

        const metadata = await AuthService.refreshToken({refreshToken})
        new CREATEDResponse({
            message: 'Refresh token successful',
            metadata
        }).send(res)
    }

    static logout = async(req, res, next) => {
        console.log('---logout')
        new NO_CONTENTReponse({
            message: 'Logout successful',
            clearCookie: true
        }).send(res)
    } 
}
module.exports = AuthController