const { Article } = require('../model/Article');
const { format } = require('date-fns');

const getAllArticles = async (req, res) => {
    const articles = await Article.find();

    if (!articles) return res.status(204).json({ "message": "No articles available"})
    
    res.json(articles);
}

const createNewArticle = async (req, res) => {
    const { title, content, tags, authorId, author } = req.body;
    
    if (!title || !content || !tags || !Array.isArray(tags) || !authorId || !author) return res.status(400).json({ "message": "The following fields are required: title, content, tags(an array), authorId, author"});

    try {
        const result = await Article.create({
            title: title,
            content: content,
            tags: tags,
            authorId: authorId,
            author: author
        })

        res.status(201).json(result)
    } catch (err) {
        console.error(err)
    }
}

const updateArticle = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": "Article ID required."})
    
    const article = await Article.findOne({ _id: req.params.id }).exec();

    if (!article) return res.status(204).json({ "message": `No article matches ID ${req.params.id}`})

    if (req.body?.title) article.title = req.body.title
    if (req.body?.content) article.content = req.body.content
    if (req.body?.title) article.tags.push(req.body.tags)
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
    if (!req?.params?.id) return res.status(400).json({ "message": "ID parameter required."})
    if (!req?.body?.username || !req?.body?.content) return res.status(400).json({ "message": "username and content required."})
    
    const article = await Article.findOne({ _id: req.params.id }).exec();

    if (!article) return res.status(204).json({ "message": `Article ID ${req.params.id} not found.`})
    
    newComment = {
        username: req.body.username,
        content: req.body.content
    }
    article.comments.push(newComment)
    const result = article.save();

    res.status(201).json(result)
}

const updateComment = async (req, res) => {
    if (!req?.params?.id || !req?.params?.commentId) res.status(400).json({ "message": "article amd comment ID required."})
    
    const updated = await Article.findOneAndUpdate({ _id: req.params.id, 'comments._id': req.params.commentId }, { $set: { 'comments.$.content': req?.body?.content } }, { new: true }).exec();

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