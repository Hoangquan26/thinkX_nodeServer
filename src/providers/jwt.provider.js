'use strict'
const jwt = require('jsonwebtoken')

const signJWT = ({payload, privateKey}) => {
    return jwt.sign(payload, privateKey, {
        expiresIn: '2h',
        algorithm: 'RS256'
    })
}

const signJWTPair = ({payload, privateKey}) => {
    const accessToken = jwt.sign(payload, privateKey, {
        expiresIn: '2h',
        algorithm: 'RS256'
    })
    const refreshToken = jwt.sign(payload, privateKey, {
        expiresIn: '7d',
        algorithm: 'RS256'
    })

    return { accessToken, refreshToken }
}

const decodeJWT = ({token, publicKey}) => {
    try {
        const decoded = jwt.verify(token, publicKey, {
            algorithms: ['RS256']
        });
        return decoded;
    } catch (error) {
        return {
            status: 'error',
            message: error.message
        };
    }
}


module.exports = {
    signJWT,
    signJWTPair,
    decodeJWT
}