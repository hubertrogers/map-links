var fs = require('fs');
var geocoder = require('geocoder');
// var _ = require('underscore')
var input = require('./world_bank_2012.json')

var locationList = [];

input.forEach(function (transfer) {
    var country = transfer['Country'];
    locationList.push(country);
})

// locationList = _.uniq(locationList)

console.log(JSON.stringify(locationList, null, 2));
