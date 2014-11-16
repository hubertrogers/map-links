var when = require('when');
var geocoder = require('geocoder');
var input = require('./locationListTemp.json');
// var input = JSON.parse('["Saint Lucia","Cambodia","Lebanon","Uruguay","Egypt","Iran"]');

var locationDict = {};

var processLocations = function(locations) {
    setTimeout(function() {
        var location = locations.shift();
        var fromDeferred = when.defer();
        if (location) {
            geocoder.geocode(location, function(err, data) {
                // do stuff with data
                try {
                    fromDeferred.resolve(data.results[0].geometry.location);
                } catch (e) {
                    console.log('fail: ', location, data);
                }
            });
            fromDeferred.promise.then(function(latlong) {
                // console.log(location);
                obj = {
                    "location": latlong,
                    "name": location
                }
                locationDict[location] = obj;
                processLocations(locations);
            });
        } else {
            console.log(JSON.stringify(locationDict, null, 2));
        }
    }, 1000);
};

processLocations(input);