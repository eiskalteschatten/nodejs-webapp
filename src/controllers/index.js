'use strict';

//const cache = require('apicache').middleware;

const { translate } = require('../lib/translate');
const track = require('../lib/matomo');


module.exports = router => {
    router.get('/', (req, res) => {
        const lang = req.lang;
        const locales = req.app.locales;
        const pageTitle = translate(lang, 'homepageTitle');

        track(req, pageTitle);

        res.render('home/index.njk', {
            title: pageTitle,
            items: [
                { name : translate(lang, 'homepageTitle') },
                { name : lang },
                { name : 'item #3' },
                { name : 'item #4' }
            ]
        });
    });
};
