const { Types, Schema, model } = require('mongoose')
const UserRole = require('../common/constants/userRole')
const DocumentStatus = require('../common/constants/documentStatus')

const DOCUMENT_NAME = 'user'
const COLLECTION_NAME = 'users'

const userSchema = new Schema({
    username: { type: String, required: true, default: 'UNKNOWN' },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    role: { type: String, enum: [UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN], default: UserRole.STUDENT },
    courses_enrolled: { type: Array, default: []},
    status: { type: String, enum: [DocumentStatus.ACTIVE, DocumentStatus.INACTIVE], default: DocumentStatus.ACTIVE} ,
    verifyToken: {type: String, required: true, unique: true}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})



module.exports = model(DOCUMENT_NAME, userSchema)