const { format } = require('date-fns');
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
        type: String,
        default: format(new Date(), 'EEEE, MMMM do, yyyy h:mm a'),
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
        type: String,
        default: format(new Date(), 'EEEE, MMMM do, yyyy h:mm a'),
        required: true
    },
    updatedAt: String
})

const Comment = mongoose.model('Comment', commentSchema)
const Article = mongoose.model('Article', articleSchema)

module.exports = { Comment, Article }