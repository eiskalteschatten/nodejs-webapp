'use strict';


module.exports = app => {
    // Catch 404 and forward to error handler
    app.use((req, res, next) => {
        const error = new Error('Not Found');
        error.status = 404;
        next(error);
    });


    // Error handlers

    // Development error handler - will print stacktrace
    if (app.get('env') === 'development') {
        // Disable no-unsed-vars rule for the next line because the "next" is required for the function to work properly
        app.use((error, req, res, next) => { // eslint-disable-line no-unused-vars
            res.status(error.status || 500);
            console.error(error.message);

            res.render('error.njk', {
                message: error.message,
                error: error
            });
        });
    }


    // Production error handler - no stacktraces leaked to user
    // Disable no-unsed-vars rule for the next line because the "next" is required for the function to work properly
    app.use((error, req, res, next) => { // eslint-disable-line no-unused-vars
        res.status(error.status || 500);
        console.error(error.message);
        res.render('error.njk');
    });
};
