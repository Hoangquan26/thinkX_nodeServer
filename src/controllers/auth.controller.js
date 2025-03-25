const AuthService = require('../services/auth.service')
const asyncHandle = require('../helpers/asyncHandle')
const { OKResponse, CREATEDResponse } = require('../common/responses/successReponse') 
class AuthController {
    static register = async(req, res, next) => {
        const {email, username, password} = req.body
        const metadata = await AuthService.register({email, password, username})
        new CREATEDResponse({
            message: 'Login successful',
            metadata
        }).send(res)
    }
    static login = async(req, res, next) => {
        const {email, password} = req.body
        const metadata = await AuthService.login({email, password})

        new OKResponse({
            message: 'Login successful',
            metadata
        }).send(res)
    }
    static refreshToken = (req, res, next) => {
        
    }
    static logout = (req, res, next) => {
    
    } 
}
module.exports = AuthController