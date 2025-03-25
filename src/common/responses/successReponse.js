'use strict'
const { StatusCodes, ReasonPhrases } = require('../statusCodes/httpStatusCode')

class SuccessResponse {
    constructor ({ message, statusCode, reasonPhase, metadata = {}, options = {}}) {
        this.message = !message ? reasonPhase : message
        this.status = statusCode
        this.metadata = metadata
        this.options = options
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

module.exports = {
    OKResponse
    ,CREATEDResponse
}