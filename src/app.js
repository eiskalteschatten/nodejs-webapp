'use strict';

const express = require('express');
const enrouten = require('express-enrouten');
const app = express();

const config = require('config');

const compression = require('compression');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const path = require('path');

const configureProxies = require('./lib/booting/proxies');
const configureRedirects = require('./lib/booting/redirects');
const configureNunjucks = require('./lib/booting/nunjucks');
const configureSass = require('./lib/booting/compileSass');
const configureErrorPages = require('./lib/booting/errorPages');
const { redirectToLanguage } = require('./lib/translate');


module.exports = async () => {
    // Express setup
    app.use(logger('dev'));
    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.disable('x-powered-by');


    // Nunjucks
    configureNunjucks(app);


    // Defaults
    app.locals = {
        ...app.locals,
        ...config.get('locals'),
        locales: config.get('locales')
    };

    // SASS compliation
    await configureSass(app);


    // Setup routes
    configureProxies(express, app);
    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/', (req, res) => {
        redirectToLanguage(req, res, '/');
    });
    app.use('/:lang', (req, res, next) => {
        req.lang = req.params.lang;
        next();
    });
    app.use('*', configureRedirects);
    app.use('/:lang', enrouten({
        directory: 'controllers'
    }));


    // Configure error pages
    configureErrorPages(app);


    console.log('App started with:');
    console.log('- Node.js', process.version);
    console.log(`- Started with NODE_ENV=${app.get('env')}`);


    return app;
};
