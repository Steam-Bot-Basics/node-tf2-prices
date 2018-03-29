'use strict';

var Prices = require('../index.js');

Prices.prototype.httpRequest = function(uri, options, callback) {
    if (typeof uri === 'object') {
        callback = options;
        options = uri;
        uri = options.url || options.uri;
    } else if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    options.url = options.uri = uri;

    if (this._httpRequestConvenienceMethod) {
        options.method = this._httpRequestConvenienceMethod;
        delete this._httpRequestConvenienceMethod;
    }

    var self = this;
    self.request(options, function (err, response, body) {
        var hasCallback = !!callback;
        var httpError = options.checkHttpError !== false && self._checkHttpError(err, response, callback, body);
        var jsonError = options.json && options.checkJsonError !== false && !body ? new Error("Malformed JSON response") : null;

        if (hasCallback && !(httpError || jsonError)) {
            if (jsonError) {
                callback.call(self, jsonError, response);
            } else {
                callback.apply(self, arguments);
            }
        }
    });
};

Prices.prototype._checkHttpError = function (err, response, callback, body) {
    if (err) {
        callback(err, response, body);
        return err;
    }

    if (response.statusCode == 429) {
        err = new Error("Too Many Requests");
        err.code = response.statusCode;
        err.retryAfter = body.response.wait * 1000 || this.retryTime;
        callback(err, response, body);
        return err;
    } 
    if (response.statusCode == 401) {
        this.stopChecker();
        this.prices = [];

        err = new Error("Unauthorized");
        err.code = response.statusCode;
        callback(err, response, body);
        return err;
    }
    if (response.statusCode == 400) {
        err = new Error("Bad Request");
        err.code = response.statusCode;
        err.reason = body.response.message;
        callback(err, response, body);
        return err;
    }
    if (response.statusCode != 200) {
        err = new Error("HTTP Error " + response.statusCode);
        err.code = response.statusCode;
        callback(err, response, body);
        return err;
    }

    return false;
};