const { Types, Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'user'
const COLLECTION_NAME = 'users'

const userSchema = new Schema({
    username: { type: String, required: true, default: 'UNKNOWN' },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
    courses_enrolled: { type: Array, default: []},
    status: { type: String, enum: ['active', 'inactive'], default: 'active'}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, userSchema)