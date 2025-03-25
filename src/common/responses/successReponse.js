'use strict'
const HeaderConstant = require('../constants/header.constant')
const { StatusCodes, ReasonPhrases } = require('../statusCodes/httpStatusCode')

class SuccessResponse {
    constructor ({ message, statusCode, reasonPhase, metadata = {}, options = {}, cookies = {}, clearCookie = false}) {
        this.message = !message ? reasonPhase : message
        this.status = statusCode
        this.metadata = metadata
        this.options = options
        this.cookies = cookies
        this.clearCookie = clearCookie
    }

    // send = (res, headers = {}) => {
    //     //wasnt tested header
    //     const emptyHeaders = headers => Object.keys(headers).length === 0
    //     if(!emptyHeaders) {
    //         console.log('::set header::')
    //         res.set(headers)
    //     }
    //     return res.status(this.status).json(this)
    // }

    send = (res) => {
        //wasnt tested header
        
        if (this.cookies && !this.clearCookie) {
            for (const [name, { value, options }] of Object.entries(this.cookies)) {
                res.cookie(name, value, options)
                console.log('---set-cookie: ' + name, value, options)
            }
        }
        if (this.clearCookie === true) {
            res.clearCookie(HeaderConstant.AUTHORIZATION)
            res.clearCookie(HeaderConstant.REFRESHTOKEN)
        }

        return res.status(this.status).json(this)
    }
}

class OKResponse extends SuccessResponse {
    constructor ({ message, statusCode = StatusCodes.OK, reasonPhase = ReasonPhrases.OK, metadata = {}, options = {} }) {
        super({message, statusCode, reasonPhase, metadata, options})
    }
}


class CREATEDResponse extends SuccessResponse {
    constructor ({ message, statusCode = StatusCodes.CREATED, reasonPhase = ReasonPhrases.CREATED, metadata = {}, options = {} }) {
        super({message, statusCode, reasonPhase, metadata, options})
    }
}

class NO_CONTENTReponse extends SuccessResponse {
    constructor ({ message, statusCode = StatusCodes.NO_CONTENT, reasonPhase = ReasonPhrases.NO_CONTENT, metadata = {}, options = {} }) {
        super({message, statusCode, reasonPhase, metadata, options})
    }
}

const cookieConstructor = ({name, value, options = {httpOnly, maxAge}}) => {
    return {
        [name]: {
            value: value,
            options: options
        }
    }
}

module.exports = {
    OKResponse,
    CREATEDResponse,
    NO_CONTENTReponse,
    cookieConstructor
}