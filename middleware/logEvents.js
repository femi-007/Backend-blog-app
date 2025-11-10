const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises= require('fs').promises;
const path = require('path');
const { error } = require('console');

const logEvents = async (message, logName) => {
    const dateTime = format(new Date(), 'ddMMyyyy\tHH:mm:ss')
    const logMsg = `${dateTime}\t${uuid()}`
    
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'events'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'events'));
        }

        await fsPromises.appendFile(path.join(__dirname, '..', 'events', logName), `${logMsg}\t${message}\n\n`);
    } catch (err) {
        console.error(err);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'request.log');
    next();
}

module.exports = { logEvents, logger }

