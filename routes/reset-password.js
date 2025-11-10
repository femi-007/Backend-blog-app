const express = require('express');
const router = express.Router();
const forgotPasswordContoller = require('../controllers/forgotPasswordController');

router.put('/:id/:token', forgotPasswordContoller.handleResetPassword);

module.exports = router;