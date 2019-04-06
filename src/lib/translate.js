'use strict';

const translations = require('../translations');
const helper = require('../lib/helper.js');

const moment = require('moment');
const config = require('config');

const locales = config.get('locales');


module.exports = {
    translate,
    redirectToLanguage,
    checkLangUrl,
    getLocalizedUrl,
    getAllLanguageUrls,
    getLocalizedDate
};

function translate(lang, string) {
    const langStrings = translations[lang];

    const useDefaultLangage = () => {
        const defaultStrings = translations[locales.defaultLanguage];

        if (defaultStrings && defaultStrings[string]) {
            return defaultStrings[string];
        }
    };

    if (langStrings && langStrings[string]) {
        return langStrings[string];
    }
    else {
        return useDefaultLangage();
    }
}

function redirectToLanguage(req, res, route) {
    let lang = req.acceptsLanguages(locales.availableLanguages);

    if (!lang) {
        lang = locales.defaultLanguage;
    }

    res.redirect(getLocalizedUrl(lang, route));
}

function checkLangUrl(req, res, route, next) {
    const lang = req.lang;

    if (locales.availableLanguages.indexOf(lang) === -1) {
        res.sendStatus(404);
    }
    else {
        next();
    }
}

function getLocalizedUrl(lang, route) {
    if (route.charAt(0) !== '/') {
        route = '/' + route;
    }

    return '/' + lang + route;
}

function getAllLanguageUrls(req) {
    const lang = req.lang;
    const urls = {};
    const route = helper.parseRoute(req.originalUrl);

    locales.availableLanguages.forEach(locale => {
        if (locale !== lang) {
            urls[locale] = getLocalizedUrl(locale, route);
        }
    });

    return urls;
}

function getLocalizedDate(date, lang) {
    return moment(date).locale(lang).format('LLL');
}
