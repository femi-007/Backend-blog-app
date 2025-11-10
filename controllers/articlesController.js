const Article = require('../model/Article');
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

module.exports = { getAllArticles, createNewArticle, updateArticle, deleteArticle, getArticle }