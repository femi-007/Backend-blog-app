const { Article } = require('../model/Article');
const { format } = require('date-fns');
const { articleSchema, commentSchema } = require('../utils/validations/resourceValidation');
const { formatValidationError } = require('../utils/format');

const getAllArticles = async (req, res) => {
    const articles = await Article.find();

    if (!articles) return res.status(204).json({ "message": "No articles available"})
    
    res.json(articles);
}

const createNewArticle = async (req, res) => {
    // validate input
    const validationResult = articleSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(400).json({
            error: 'validation error',
            details: formatValidationError(validationResult.error)
        })
    }

    const { title, content, tags, authorId, author } = validationResult.data;

    // create article
    try {
        const result = await Article.create({
            title,
            content,
            tags,
            authorId,
            author
        })

        res.status(201).json(result)
    } catch (err) {
        console.error(err)
    }
}

const updateArticle = async (req, res) => {
    // validate input
    if (!req?.params?.id) return res.status(400).json({ "message": "Article ID required."})

    const updateArticleSchema = articleSchema.partial();
    const validationResult = updateArticleSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(400).json({
            error: 'validation error',
            details: formatValidationError(validationResult.error)
        })
    }

    const { title, content, tags } = validationResult.data

    // check if article exists
    const article = await Article.findOne({ _id: req.params.id }).exec();

    if (!article) return res.status(204).json({ "message": `No article matches ID ${req.params.id}`});

    // update article
    if (title) article.title = title
    if (content) article.content = content
    if (tags) article.tags.push(tags)
    article.updatedAt = format(new Date(), 'EEEE, MMMM do, yyyy h:mm a')

    const result = article.save();
    res.json(result);
}

const deleteArticle = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": "Article ID required."})
    
    const article = await Article.findOne({ _id: req.params.id }).exec();

    if (!article) return res.status(204).json({ "message": `No article matches ID ${req.params.id}`})

    const result = await article.deleteOne({ _id: req.params.id});
    res.json(result);
}

const getArticle = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": "ID parameter required."})
    
    const article = await Article.findOne({ _id: req.params.id }).exec();

    if (!article) return res.status(404).json({ "message": `Article ID ${req.params.id} not found.`})

    res.json(article);
}

const getAllComments = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": "ID parameter required."})
    
    const article = await Article.findOne({ _id: req.params.id }).exec();

    if (!article) return res.status(204).json({ "message": `Article ID ${req.params.id} not found.`})
    
    const comments = article.comments;
    if (!comments.length) return res.status(204).json({ "message": "No comments yet"})
    
    res.json(comments);

}

const createNewComment = async (req, res) => {
    // validate input
    if (!req?.params?.id) return res.status(400).json({ "message": "ID parameter required."})

    const validationResult = commentSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(400).json({
            error: 'validation error',
            details: formatValidationError(validationResult.error)
        })
    }

    const { username, content } = validationResult.data;

    // check if comment exists
    const article = await Article.findOne({ _id: req.params.id }).exec();

    if (!article) return res.status(204).json({ "message": `Article ID ${req.params.id} not found.`})
    
    // create comment
    const newComment = {
        username,
        content
    }
    article.comments.push(newComment)
    const result = article.save();

    res.status(201).json(result)
}

const updateComment = async (req, res) => {
    // validate input
    if (!req?.params?.id || !req?.params?.commentId) res.status(400).json({ "message": "article amd comment ID required."})
    
    const updateCommentSchema = commentSchema.partial();
    const validationResult = updateCommentSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(400).json({
            error: 'validation error',
            details: formatValidationError(validationResult.error)
        })
    }

    const { content } = validationResult.data

    // find and update comment
    const updated = await Article.findOneAndUpdate({ _id: req.params.id, 'comments._id': req.params.commentId }, { $set: { 'comments.$.content': content } }, { new: true }).exec();

    if (!updated) return res.status(204).json({ "message": `No comment matches ID ${req.params.commentId}`})

    res.json(updated)
}

const deleteComment = async (req, res) => {
    if (!req?.params?.id || !req?.params?.commentId) res.status(400).json({ "message": "article amd comment ID required."})
    
    const updated = await Article.findOneAndUpdate({ _id: req.params.id }, { $pull: { comments: { _id: req.params.commentId } } }, { new: true }).exec();

    if (!updated) return res.status(204).json({ "message": `No comment matches ID ${req.params.commentId}`})

    res.json(updated)
}

module.exports = { 
    getAllArticles, 
    createNewArticle, 
    updateArticle, 
    deleteArticle, 
    getArticle, 
    getAllComments,
    createNewComment,
    updateComment,
    deleteComment
}