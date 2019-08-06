'use strict';

const path = require('path');
const compileSass = require('compile-sass');
const config = require('config');

const cssConfig = config.get('css');

const iAmHere = path.join(__dirname, '../../');

function setupCleanupOnExit() {
    process.on('SIGINT', () => {
        try {
            compileSass.setupCleanupOnExit(path.join(iAmHere, 'public/css/'));
            process.exit(0);
        }
        catch(error) {
            process.exit(1);
        }
    });
}

module.exports = app => {
    if (app.get('env') === 'staging' || app.get('env') === 'production') {
        return compileSass.compileSassAndSaveMultiple({
            sassPath: path.join(iAmHere, 'scss/'),
            cssPath: path.join(iAmHere, 'public/css/'),
            files: cssConfig.sassFilesToCompile
        }).then(() => {
            setupCleanupOnExit();
        }).catch(error => {
            throw new Error(error);
        });
    }
    else {
        // If not staging or production, just compile the libs.scss

        return compileSass.compileSassAndSaveMultiple({
            sassPath: path.join(iAmHere, 'scss/'),
            cssPath: path.join(iAmHere, 'public/css/'),
            files: ['libs.scss']
        }).then(() => {
            app.use('/css/:cssName', compileSass.setup({
                sassFilePath: path.join(iAmHere, 'scss/')
            }));

            setupCleanupOnExit();
        }).catch(error => {
            throw new Error(error);
        });
    }
};
