'use strict';

var Prices = require('../index.js');

Prices.prototype._fetchList = function(callback) {
    this._apiCall("GET", "list", "v1", function (err, response) {
        if (err) {
            callback(err);
            return;
        }

        callback(null, response.items);
    });
};

Prices.prototype._fetchPrices = function(callback) {
    var self = this;
    self._apiCall("GET", "prices", "v1", function(err, response) {
        if (err) {
            callback(err);
            return;
        }

        self.emit('prices', response.items);
        self._findUpdates(response.items);
        self.prices = response.items;
        callback(null, response.items);
    });
};

Prices.prototype._fetchCurrencies = function(callback) {
    var self = this;
    self._apiCall("GET", "currencies", "v1", function(err, response) {
        if (err) {
            callback(err);
            return;
        }

        self.currencies = response.currencies;
        self.emit("currencies", self.currencies);

        callback(null, response.currencies);
    });
};

Prices.prototype._pushItems = function(items, callback) {
    var self = this;
    self._apiCall("POST", "list", "v1", items, function(err, response) {
        if (err) {
            callback(err);
            return;
        }

        callback(null, response.added);
    });
};

Prices.prototype._removeItems = function(items, callback) {
    var self = this;
    self._apiCall("DELETE", "list", "v1", items, function(err, response) {
        if (err) {
            callback(err);
            return;
        }

        callback(null, response.removed);
    });
};