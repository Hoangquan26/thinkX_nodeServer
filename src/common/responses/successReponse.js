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
        if (this.cookies && Object.keys(this.cookies).length > 0) {
            for (const [name, { value, options }] of Object.entries(this.cookies)) {
                res.cookie(name, value, options);
            }
        }

        // Clear cookie nếu cần
        if (this.clearCookie) {
            res.clearCookie(HeaderConstant.REFRESHTOKEN); // Đặt tên cookie chính xác
        }

        return res.status(this.status).json({
            ...this,
            clearCookie: null,
            cookies: null
        });
    }
}

class OKResponse extends SuccessResponse {
    constructor ({ message, statusCode = StatusCodes.OK, reasonPhase = ReasonPhrases.OK, metadata = {}, options = {}, cookies, clearCookie }) {
        super({message, statusCode, reasonPhase, metadata, options, cookies, clearCookie})
    }
}


class CREATEDResponse extends SuccessResponse {
    constructor ({ message, statusCode = StatusCodes.CREATED, reasonPhase = ReasonPhrases.CREATED, metadata = {}, options = {}, cookies, clearCookie }) {
        super({message, statusCode, reasonPhase, metadata, options, cookies, clearCookie})
    }
}

class NO_CONTENTReponse extends SuccessResponse {
    constructor ({ message, statusCode = StatusCodes.NO_CONTENT, reasonPhase = ReasonPhrases.NO_CONTENT, metadata = {}, options = {}, cookies, clearCookie }) {
        super({message, statusCode, reasonPhase, metadata, options, cookies, clearCookie})
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