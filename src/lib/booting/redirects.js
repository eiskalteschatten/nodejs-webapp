'use strict';

const config = require('config');
const redirects = config.get('redirects');

const { parseRoute } = require('../helper');


module.exports = (req, res, next) => {
    const originalUrl = '/' + parseRoute(req.originalUrl.replace(/\/$/, ''));
    const regexString = `^${originalUrl}/?$`;
    const regex = new RegExp(regexString, 'g');

    for (const redirectedUrl in redirects) {
        if (regex.test(redirectedUrl)) {
            const redirectUrl = '/' + req.lang + redirects[redirectedUrl];
            res.redirect(301, redirectUrl);
            return;
        }
    }

    next();
};
