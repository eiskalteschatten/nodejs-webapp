'use strict';

const { translate }  = require('./translate');

module.exports = {
    returnError
};

function returnError(error, req, res) {
    console.error(error);
    res.status(error.status || 500).send(error.message || translate(req.lang, 'anErrorOccurred'));
}
