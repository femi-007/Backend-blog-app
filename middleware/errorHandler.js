const { logEvents } = require('./logEvents')

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'error.log')
    console.error(err.stack)
    res.status(500).send("Something went wrong.");
}

module.exports = errorHandler;