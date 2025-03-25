const Joi = require('joi')
const { USERNAME_RULE, USERNAME_RULE_MESSAGE, EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } = require('../utils/validators')
const { UnprocesstableError } = require('../common/responses/errorReponse')

class AuthValidation {
    static register = async(req, res, next) => {
        const correctValidation = Joi.object({
            username: Joi.string().required().pattern(USERNAME_RULE).message(USERNAME_RULE_MESSAGE),
            email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
            password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE)
        })

        try {
            const isValid = await correctValidation.validateAsync(req.body, {abortEarly: true})
            return next()
        }
        catch(error) {
            console.log(`---validation error:::${error}`)
            return next(new UnprocesstableError(error.message))
        }
    }

    static login = async(req, res, next) => {
        const correctValidation = Joi.object({
            email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
            password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE)
        })

        try {
            const isValid = await correctValidation.validateAsync(req.body, {abortEarly: true})
            return next()
        }
        catch(error) {
            console.log(`---validation error:::${error}`)
            return next(new UnprocesstableError(error.message))
        }
    }
}

module.exports = AuthValidation