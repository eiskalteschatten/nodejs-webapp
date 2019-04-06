'use strict';

module.exports = {
    parseRoute
};

function parseRoute(origRoute) {
    const route = origRoute.split('/');
    route.splice(0, 2);
    return route.join('/');
}
