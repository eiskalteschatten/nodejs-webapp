'use strict';

const { translate } = require('../../lib/translate');
const track = require('../../lib/matomo');

const { returnError } = require('../../lib/apiErrorHandling');


module.exports = router => {
    router.get('/', (req, res) => {
        const lang = req.lang;
        track(req, 'Example API');

        const random = Math.floor(Math.random() * Math.floor(2));

        // If random === 0, throw an error just for demonstration purposes
        if (random === 0) {
            return returnError({
                status: 418,
                message: 'I am a teapot'
            }, req, res);
        }

        res.json({
            message: translate(lang, 'success')
        });
    });
};
