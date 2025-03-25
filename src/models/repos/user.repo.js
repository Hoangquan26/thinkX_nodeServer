'use strict'
const userModel = require('../user.model')

//DEFAULT QUERY
const findUserByEmail = (email) => {
    return userModel.findOne({email})
}

//DEFAULT CREATE
const createDefaultUser = async({email, hashedPassword ,username = "UNKNOWN"}) => {
    return await userModel.create({
        email,
        hashedPassword,
        username
    })
}

//LEAN QUERY
const findUserByEmailLean = (email) => {
    return userModel.findOne({email}).lean()
}

module.exports = {
    findUserByEmail,
    createDefaultUser,
    findUserByEmailLean,
}