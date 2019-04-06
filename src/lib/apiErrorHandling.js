'use strict';

const { translate }  = require('./translate');

module.exports = {
    returnError
};

function returnError(error, req, res) {
    if (error.status) {
        res.status(error.status).send(error.message);
    }
    else {
        console.error(error);
        res.status(500).send(translate(req.lang, 'anErrorOccurred'));
    }
}
