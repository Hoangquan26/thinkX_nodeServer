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
const findUserByEmailLean = async(email) => {
    return await userModel.findOne({email}).lean()
}

const findUserByIdLean = async(userId) => {
    userId = convertObjectId(userId)
    return await userModel.findById(userId).lean()
}

//UPDATE 
const updateUserById = async(userId, updateData) => {
    userId = convertObjectId(userId)
    const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        updateData,
        {
          new: true, 
          runValidators: true, 
        }
    )
    .select("-hashedPassword -verifyToken") 
    .lean();
    return updatedUser;
}

const updateUserPassword = async(userId, hashedPassword) => {
    return await userModel.findByIdAndUpdate(userId, {
        hashedPassword: newHashedPassword
    });
}


module.exports = {
    findUserByEmail,
    createDefaultUser,
    findUserByEmailLean,
    findUserById,
    findUserByIdLean,
    updateUserById,
    updateUserPassword
}