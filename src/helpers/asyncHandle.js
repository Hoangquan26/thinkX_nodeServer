'use strict'
const asyncHandle = (fn) => {
    return (req, res, next) => {
        console.log(fn)
        return fn(req, res, next).catch(next)
    }
}

module.exports = asyncHandle