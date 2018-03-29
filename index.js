'use strict';

const request = require('request');

module.exports = Prices;

require('util').inherits(Prices, require('events').EventEmitter);

function Prices(options) {
    options = options || {};

    this.apiKey = options.apiKey;
    this.retry = options.retry || true;
    this.retryTime = options.retryTime || 2 * 1000;
    this.getPricesTime = options.pollTime || 30 * 1000;
    this.getCurrenciesTime = options.currenciesTime || 10 * 60 * 1000;

    this.prices = [];
    this.currencies = {};

    this.request = request;
}

Prices.prototype.init = function(callback) {
    var self = this;
    self.getCurrencies(function(err, currencies) {
        if (err) {
            callback(err);
            return;
        }

        self.getPrices(function(err, prices) {
            if (err) {
                callback(err);
                return;
            }

            callback(null);
            self.startChecker();
        });
    });
};

Prices.prototype.setPrices = function(prices) {
    this.prices = prices;
};

Prices.prototype.startChecker = function() {
    this._priceChecker = setInterval(Prices.prototype.getPrices.bind(this), this.getPricesTime);
    this._currenciesChecker = setInterval(Prices.prototype.getCurrencies.bind(this), this.getCurrenciesTime);
};

Prices.prototype.stopChecker = function() {
    clearInterval(this._priceChecker);
    clearInterval(this._currenciesChecker);
};

require('./lib/http.js');
require('./lib/webapi.js');
require('./lib/requests.js');
require('./lib/methods.js');
require('./lib/prices.js');