'use strict';

var Prices = require('../index.js');

Prices.prototype._apiCall = function(httpMethod, method, version, input, callback) {
    if (typeof input == 'function') {
        callback = input;
        input = null;
    }

    if (!this.apiKey) {
        callback(new Error("No API-Key set (yet)"));
        return;
    }

    var options = {
        "uri": `https://nicklas.io/api/${version}/${method}`,
        "json": true,
        "method": httpMethod,
        "gzip": true,
        "timeout": 10000,
        "qs": {
            "key": this.apiKey
        }
    };

    input = input || {};
    if (httpMethod != 'GET') {
        options['body'] = input;
    }

    this.httpRequest(options, function(err, response, body) {
        if (err) {
            callback(err);
            return;
        }

        if (!body || typeof body != 'object') {
            callback(new Error('Invalid API response'));
            return;
        }

        callback(null, body.response);
    });
};