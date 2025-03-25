const AuthService = require('../services/auth.service')
const asyncHandle = require('../helpers/asyncHandle')

class AuthController {
    static register = async(req, res, next) => {
        const {email, username, password} = req.body
        const metadata = await AuthService.register({email, password, username})
        
    }
    static login = (req, res, next) => {
        
    }
    static refreshToken = (req, res, next) => {
        
    }
    static logout = (req, res, next) => {
    
    } 
}
module.exports = AuthController