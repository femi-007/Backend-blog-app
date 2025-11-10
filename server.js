require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn')
const PORT = process.env.PORT;

// Connect to MongoDB
connectDB(); 

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
// in other words, form data
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use(express.static(path.join(__dirname, '/public')));

// Routes
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/forgot-password', require('./routes/forgot-password'));
app.use('/reset-password', require('./routes/reset-password'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

// Protected routes
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));
app.use('/articles', require('./routes/api/articles'));

// Wildcard routes
app.all(/.*/, (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found"});
    } else {
        res.type('txt').send("404 Not Found");
    }
});

//Error logs custom middlemare
app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('DB connected')
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})