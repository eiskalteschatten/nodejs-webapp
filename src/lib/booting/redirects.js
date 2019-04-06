'use strict';

const config = require('config');
const redirects = config.get('redirects');

const { parseRoute } = require('../helper');


module.exports = (req, res, next) => {
    const originalUrl = '/' + parseRoute(req.originalUrl);
    const newUrl = redirects[originalUrl];

    if (newUrl) {
        const redirectUrl = '/' + req.lang + newUrl;
        res.redirect(301, redirectUrl);
        return;
    }

    next();
};
