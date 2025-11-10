const { format } = require('date-fns');
const mongoose = require('mongoose');
const Schema = mongoose.Schema

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
    createdAt: {
        type: String,
        default: format(new Date(), 'EEEE, MMMM do, yyyy h:mm a'),
        required: true
    },
    updatedAt: String
})

module.exports = mongoose.model('Article', articleSchema);