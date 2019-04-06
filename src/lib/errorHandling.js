'use strict';

const { translate }  = require('./translate');

module.exports = {
    returnError
};

function returnError(error, res, req) {
    if (error.statusCode) {
        res.status(error.statusCode).send(error.message);
    }
    else {
        console.error(error);
        res.status(500).send(translate(req.lang, 'anErrorOccurred', req.app.locales));
    }
}
