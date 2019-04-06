'use strict';

const express = require('express');
const enrouten = require('express-enrouten');
let app = express();

const config = require('config');

const compression = require('compression');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const path = require('path');

const proxies = require('./lib/booting/proxies');
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
    app = require('./lib/booting/nunjucks.js')(app);


    // Defaults
    app.locals = {
        ...app.locals,
        ...config.get('locals'),
        locales: config.get('locales')
    };

    // SASS compliation and frontend JavaScript concatination
    app = await require('./lib/booting/compileSass')(app);


    // Setup routes
    app = proxies(express, app);
    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/', (req, res) => {
        redirectToLanguage(req, res, '/');
    });
    app.use('/:lang', (req, res, next) => {
        req.lang = req.params.lang;
        next();
    });
    app.use('/:lang', enrouten({
        directory: 'controllers'
    }));


    // Catch 404 and forward to error handler
    app.use((req, res, next) => {
        const error = new Error('Not Found');
        error.status = 404;
        next(error);
    });


    // Error handlers

    // Development error handler - will print stacktrace
    if (app.get('env') === 'development') {
        app.use((error, req, res, next) => {
            res.status(error.status || 500);
            console.error(error.message);

            res.render('error.njk', {
                message: error.message,
                error: error
            });
        });
    }


    // Production error handler - no stacktraces leaked to user
    app.use((error, req, res, next) => {
        res.status(error.status || 500);
        console.error(error.message);
        res.render('error.njk');
    });


    console.log('App started with:');
    console.log('- Node.js', process.version);
    console.log(`- Started with NODE_ENV=${app.get('env')}`);


    return app;
};
