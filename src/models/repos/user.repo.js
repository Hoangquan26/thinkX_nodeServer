'use strict'
const userModel = require('../user.model')
const { convertObjectId } = require('../../utils/mongo')
//DEFAULT QUERY
const findUserByEmail = (email) => {
    return userModel.findOne({email})
}

const findUserById = (userId) => {
    userId = convertObjectId(userId)
    return userModel.findById(userId)
}


//DEFAULT CREATE
const createDefaultUser = async({email, hashedPassword ,username, verifyToken}) => {
    return await userModel.create({
        email,
        hashedPassword,
        username,
        verifyToken
    })
}

//LEAN QUERY
const findUserByEmailLean = (email) => {
    return userModel.findOne({email}).lean()
}

const findUserByIdLean = (userId) => {
    userId = convertObjectId(userId)
    return userModel.findById(userId).lean()
}


module.exports = {
    findUserByEmail,
    createDefaultUser,
    findUserByEmailLean,
    findUserById,
    findUserByIdLean
}