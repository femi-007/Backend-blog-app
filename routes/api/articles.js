const express = require('express');
const router = express.Router();
const articlesController = require('../../controllers/articlesController');
const ROLES_LIST = require('../../config/roles_list')
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(articlesController.getAllArticles)
    .post(verifyRoles(ROLES_LIST.Author), articlesController.createNewArticle)

router.route('/:id')
    .put(verifyRoles(ROLES_LIST.Author), articlesController.updateArticle)
    .delete(verifyRoles(ROLES_LIST.Author), articlesController.deleteArticle)
    .get(articlesController.getArticle)

router.route('/:id/comments')
    .get(articlesController.getAllComments)
    .post(articlesController.createNewComment)

router.route('/:id/comments/:commentId')
    .put(articlesController.updateComment)
    .delete(articlesController.deleteComment)
    
module.exports = router;