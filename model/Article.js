const mongoose = require('mongoose');
const Schema = mongoose.Schema

const commentSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    }
})

const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    comments: [commentSchema],
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    updatedAt: Date
})

const Comment = mongoose.model('Comment', commentSchema)
const Article = mongoose.model('Article', articleSchema)

module.exports = { Comment, Article }