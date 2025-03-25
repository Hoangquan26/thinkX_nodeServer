const bcrypt = require('bcrypt')
const config = require('../configs/app.config')

const BCRYPT_SALT = config.ENCODE_SALT

const hashBcryptSync = (text) => {
    return bcrypt.hashSync(text, BCRYPT_SALT)
}

const compareBcryptSync = (text, hashedText) => {
    return bcrypt.compareSync(text, hashedText)
}

module.exports = {
    hashBcryptSync,
    compareBcryptSync
}