'use strict';

var Prices = require('../index.js');

Prices.prototype._findUpdates = function(prices) {
    var self = this;

    var found = [];

    // Find items that are new, updated and removed.
    this.prices.forEach(function(price) {
        var match = findItem(price.item.name, prices);
        if (match == null) {
            // Did not find the item in the new pricelist.
            self.emit('price', 3, price.item);
        } else if (JSON.stringify(price.price.buy) != JSON.stringify(JSON.stringify(match.price.buy)) || JSON.stringify(price.price.sell) != JSON.stringify(JSON.stringify(match.price.sell))) {
            // Found a match, and the prices have changed.
            self.emit('price', 2, price.item, price.price);
            found.push(match);
        } else {
            // Found a match, and the prices havn't changed.
            found.push(match);
        }
    });

    // If this is true, then new items has been added.
    if (prices.length - found.length > 0) {
        var count = prices.length - found.length;
        // Loop the current pricelist
        for (var i = 0; i < prices.length; i++) {
            if (count == 0) {
                break;
            }
            var item = prices[i].item;
            // Check if the item from the current pricelist was found when we checked if it was in the new pricelist.
            var match = findItem(item.name, found);
            if (match == null) {
                self.emit('price', 1, prices[i].item, prices[i].price);
                count--;
            }
        }
    }
};

Prices.prototype.getPrice = function(search) {
    if (typeof search == 'string') {
        for (var i = 0; i < this.prices.length; i++) {
            var name = this.prices[i].item.name;
            if (name == search) {
                return {
                    item: this.prices[i].item,
                    price: this.prices[i].price
                };
            }
        }
    } else {
        for (var i = 0; i < this.prices.length; i++) {
            var item = this.prices[i].item;
            if (item.defindex == search.defindex && item.quality == search.quality && item.craftable == search.craftable && item.killstreak == search.killstreak && item.australium == search.australium) {
                return {
                    item: this.prices[i].item,
                    price: this.prices[i].price
                };
            }
        }
    }

    return null;
}

function findItem(name, prices) {
    for (var i = 0; i < prices.length; i++) {
        var item = prices[i].item;
        if (name == item.name) {
            return prices[i];
        }
    }
    return null;
}