const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    roles: {
        user: {
            type: Number,
            default: 2010
        },
        Editor: Number,
        Admin: Number,
        Author: Number
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String
})

module.exports = mongoose.model('User', userSchema);