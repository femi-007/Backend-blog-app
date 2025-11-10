const express = require('express');
const router = express.Router();
const forgotPasswordContoller = require('../controllers/forgotPasswordController');

router.post('/', forgotPasswordContoller.handleForgotPassword);

module.exports = router;