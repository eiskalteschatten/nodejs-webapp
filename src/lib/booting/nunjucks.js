'use strict';

const nunjucks  = require('nunjucks');
const nunjucksMarkdown  = require('nunjucks-markdown');
const marked  = require('marked');
const path = require('path');

const helper = require('../helper');
const transLib = require('../translate');


module.exports = app => {
    // View engine setup
    app.set('view engine', 'html');

    const nunjucksEnv = nunjucks.configure(path.join(__dirname, '../../views'), {
        autoescape: true,
        express: app
    });


    // Custom filters in Nunjucks
    nunjucksEnv.addFilter('translate', (str, lang) => {
        return transLib.translate(lang, str);
    });

    nunjucksEnv.addFilter('langUrl', (route, lang) => {
        return transLib.getLocalizedUrl(lang, route);
    });

    nunjucksEnv.addFilter('formatDate', (date, lang) => {
        return transLib.getLocalizedDate(date, lang);
    });


    // Globals
    nunjucksEnv.addGlobal('getAllLanguageUrls', req => {
        return transLib.getAllLanguageUrls(req);
    });

    nunjucksEnv.addGlobal('getCurrentYear', () => {
        return new Date().getFullYear();
    });

    nunjucksEnv.addGlobal('appLocales', app.locals.locales);


    // Setup Nunjucks Markdown
    nunjucksMarkdown.register(nunjucksEnv, marked);


    // Set the app's engine to Nunjucks
    app.set('engine', nunjucksEnv);

    // Add the Express request globally to Nunjucks
    app.use((req, res, next) => {
        const engine = res.app.get('engine');
        const route = helper.parseRoute(req.originalUrl);

        engine.addGlobal('req', req);
        engine.addGlobal('plainRoute', route);
        engine.addGlobal('baseUrl', req.protocol + '://' + req.get('host'));

        next();
    });
};
