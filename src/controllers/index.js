'use strict';

const { translate } = require('../lib/translate');
const track = require('../lib/matomo');
const { markdownToHtml } = require('../lib/markdown');


module.exports = router => {
    router.get('/', (req, res) => {
        const lang = req.lang;
        const pageTitle = translate(lang, 'homepageTitle');

        track(req, pageTitle);

        const markdown = markdownToHtml(`
# Controller-Rendered
This is **controller-rendered** markdown.
        `);

        res.render('home/index.njk', {
            title: pageTitle,
            items: [
                { name : translate(lang, 'homepageTitle') },
                { name : lang },
                { name : 'item #3' },
                { name : 'item #4' }
            ],
            markdown
        });
    });
};
