'use strict'
const jwt = require('jsonwebtoken')

const signJWT = ({payload, privateKey}) => {
    return jwt.sign(payload, privateKey)
}

const signJWTPair = ({payload, privateKey}) => {
    const accessToken = jwt.sign(payload, privateKey, {
        expiresIn: '2h'
    })

    const refreshToken = jwt.sign(payload, privateKey, {
        expiresIn: '7d'
    })

    return { accessToken, refreshToken }
}

const decodeJWT = (token, publicKey) => {
    try {
        const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        return decoded;
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        return null;
    }
}


module.exports = {
    signJWT,
    signJWTPair,
    decodeJWT
}