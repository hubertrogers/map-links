var po = org.polymaps;
// Create the map object, add it to #map…
var map = po.map()
    .container(d3.select("#map")
        .append("svg:svg")
        .node())
    .zoom(2)
    .center({
        lat: 20,
        lon: 0
    })
    .add(po.interact());

// // Add the CloudMade image tiles as a base layer…
// map.add(po.image()
//   .url(po.url("http://{S}tile.cloudmade.com" + "/677444bfa43f4b1a99a366b991353d2d" // http://cloudmade.com/register
//       +
//       // "/998/256/{Z}/{X}/{Y}.png")
//       // "/44094/256/{Z}/{X}/{Y}.png")
//       "/84076/256/{Z}/{X}/{Y}.png")
//     .hosts(["a.", "b.", "c.", ""])));


// Add the MapBox image tiles as a base layer…
map.add(po.image()
    .url(po.url("http://api.tiles.mapbox.com/v4/hubertrogers.j0idljd8/{Z}/{X}/{Y}.png?access_token=sk.eyJ1IjoiaHViZXJ0cm9nZXJzIiwiYSI6ImRwYjV0MTQifQ.0AgjbqhTKyiHMjOWEXUJOA")
        .hosts(["a.", "b.", "c.", ""])));

// Add the compass control on top.
var compass = po.compass()
    .position("bottom-left")
    .pan("small");
map.add(compass);


// sync up the d3 projection with the polymaps coords system
var pt = map.locationPoint({
    lat: 0,
    lon: 0
});

var projection = d3.geo.mercator()
    .translate([pt.x, pt.y])
    .scale(Math.pow(2, map.zoom()) * 256)

// the path generator
var path = d3.geo.path()
    .projection(projection)

// this guy calculates the points of the great arc
var arc = d3.geo.greatArc()
    .source(function(d) {
        return d.from;
    })
    .target(function(d) {
        return d.to;
    });

var rScale = {
    data: [],
    func: function(d) {
        scaleUnits = d3.scale.linear()
            .domain([0, d3.max(rScale.data, function(f) {
                return parseFloat(f.units);
            })])
            .range([4, 20]);
        return scaleUnits(d.units)
    }
};

var rdBuScale = d3.scale.quantile()
    .domain([0, 1])
    .range(colorbrewer.RdBu[5]);
// .rangeR



function hideMarkers(transitionTime, delayShort, delayLong) {
    if (typeof transitionTime == 'undefined') {
        transitionTime = 500;
    }
    if (typeof delayShort == 'undefined') {
        delayShort = 3;
    }
    if (typeof delayLong == 'undefined') {
        delayLong = 10;
    }
    //console.log("hideLinks.....");
    var markers = d3.selectAll('circle.marker')
    markers.transition()
        .duration(transitionTime)
        .delay(function(d, i) {
            return delayShort * i
        })
        .style('fill-opacity', 0)
        .transition()
        .delay(function(d, i) {
            return delayLong * i
        })
        .attr('r', 0)
        .remove();
    //          rScale = {};


    // var li = locsLayer.selectAll("circle.marker")
    //   .data(data);
    // li.exit()
    //   .remove();
}

function hideLinks(transitionTime, delayShort, delayLong) {
    if (typeof transitionTime == 'undefined') {
        transitionTime = 500;
    }
    if (typeof delayShort == 'undefined') {
        delayShort = 3;
    }
    if (typeof delayLong == 'undefined') {
        delayLong = 10;
    }
    $('#table')
        .mCustomScrollbar("destroy");


    var destinations = d3.select('#map svg')
        .selectAll('circle.destination')
    destinations.transition()
        .duration(transitionTime)
        .delay(function(d, i) {
            return delayShort * i
        })
        .style('fill-opacity', 0)
        .transition()
        .delay(function(d, i) {
            return delayLong * i
        })
        .attr('r', 0)
        .remove()

    var sources = d3.select('#map svg')
        .selectAll('circle.source');
    sources.transition()
        .duration(transitionTime)
        .delay(function(d, i) {
            return delayShort * i
        })
        .style('fill-opacity', 0)
        .transition()
        .delay(function(d, i) {
            return delayLong * i
        })
        .attr('r', 0)
        .remove()


    var links = d3.select('#map svg')
        .selectAll('path.shippingPath')
    links.transition()
        .duration(transitionTime)
        .delay(function(d, i) {
            return delayShort * i
        })
        .style('stroke-opacity', 0)
        .remove()

    var buttons = d3.select('#map svg')
        .selectAll('path.button')
    buttons.transition()
        .duration(transitionTime)
        .delay(function(d, i) {
            return 100 * i
        })
        .style('stroke-opacity', 0)
        .attr('r', 0)
        .remove()



    d3.selectAll('circle.marker')
        .transition()
        .duration(transitionTime)
        .attr("r", function(d) {
            return rScale.func(d);
        })

    d3.selectAll('circle.buttons')
        .remove()

    //////////////////////
    tableData = {
        headers: ["Source", "Destination", "$ (million)"],
        rows: [
            ["-", "-", "-"]
        ]
    }
    d3.select('div#table')
        .datum(tableData)
        .call(tableFunc)
        //////////////////////
}

function growDS(d, e, data, transitionTime) {
    //    console.log(d,e)

    var currentR = d3.select(e)
        .attr("r");
    //console.log("Grow1: currentR", currentR)

    d3.select(e)
        .transition()
        .duration(transitionTime / 2)
        .delay(0)
        .attr("r", function(d) {
            return rScale.func(d) + 1
        })
    d3.select(e)
        .transition()
        .duration(transitionTime / 2)
        .delay(500)
        .attr("r", rScale.func(d));
    //.attr("r", currentR);
}

function pathGrow(d, i, pathClass, transitionTime) {
    linksLayer.select(pathClass + ":nth-child(" + (i + 1) + ")")
        .transition()
        .duration(transitionTime / 2)
        .style("stroke-width", function(d) {
            console.log(d);
            return (rScale.func(d) + 4)
        })
        .style("stroke", "#FFCA1B")

}

function pathShrink(d, i, pathClass, transitionTime) {
    linksLayer.select(pathClass + ":nth-child(" + (i + 1) + ")")
        .transition()
        .duration(transitionTime / 2)
        .style("stroke-width", function(d) {
            console.log(d);
            return rScale.func(d)
        })
        .style("stroke", function(d) {
            return "#EA3556";
        })

}



var locsLayer = d3.select('#map svg')
    .insert("svg:g", ".compass")
    .attr('class', 'locs')
var linksLayer = d3.select('#map svg')
    .insert("svg:g", ".compass")
    .attr('class', 'links');

// add a layer for the buttons
var buttonsLayer = d3.select("#map svg")
    .selectAll('g.buttons')
    .data([
        []
    ])
    // if it's not there add it under the .compass
buttonsLayer.enter()
    .insert("svg:g", ".compass")
    .attr("class", "buttons");
// add a layer for the destinations
var destinationsLayer = d3.select("#map svg")
    .selectAll('g.destinations')
    .data([
        []
    ])
    // if it's not there add it under the .compass
destinationsLayer.enter()
    .insert("svg:g", ".compass")
    .attr("class", "destinations");

// add a layer for the sources
var sourcesLayer = d3.select("#map svg")
    .selectAll('g.sources')
    .data([
        []
    ])
    // if it's not there add it under the .compass
sourcesLayer.enter()
    .insert("svg:g", ".compass")
    .attr("class", "sources");

// scaffolding for the map
//    // Insert our layer beneath the compass.
var tableFunc = table();
///////////////////



function update() {
    var downtime = +new Date();
    var uptime = +new Date();
    // console.log("updating.....")
    updateProjection()

    d3.selectAll("image")
        .on("mousedown", function() {
            update.downtime = +new Date();
        })
        .on("mouseup", function() {
            update.uptime = +new Date();
        })
        .on("click", function() {
            var delta = update.uptime - update.downtime;
            // console.log(update.uptime, update.downtime, delta)
            if (delta <= 150) {
                hideLinks(500)
            }
        })

    locsLayer.selectAll("circle.marker")
        .attr("transform", transform);
    linksLayer.selectAll("path.shippingPath")
        .attr("d", function(d) {
            if (d) {
                return path(arc({
                    from: d.from,
                    to: [d.lon, d.lat]
                }))
            }
        });
    destinationsLayer.selectAll("circle.destination")
        .attr("transform", function(d) {
            if (d) {
                return transform(d)
            }
        })
    sourcesLayer.selectAll("circle.source")
        .attr("transform", function(d) {
            if (d) {
                return transform(d)
            }
        })
    buttonsLayer.selectAll("path.button.Inbound")
        .attr("transform", function(d) {
            if (d) {
                return transformSourceButton(d)
            }
        })
    buttonsLayer.selectAll("path.button.Outbound")
        .attr("transform", function(d) {
            if (d) {
                return transformDestButton(d)
            }
        })
    buttonsLayer.selectAll("circle.buttons")
        .attr("transform", function(d) {
            if (d) {
                return transform(d)
            }
        })

}

function updateProjection() {
    var zero = map.locationPoint({
        lat: 0,
        lon: 0
    });
    zero = [zero.x, zero.y];
    var zoom = map.zoom();
    projection.translate(zero)
        .scale(Math.pow(2, zoom) * 256);

}

function transform(d) {
    d = map.locationPoint({
        lon: d.lon,
        lat: d.lat
    });
    //console.log("translate(" + d.x + "," + d.y + ")");
    return "translate(" + d.x + "," + d.y + ")";
}

function transformSourceButton(d) {
    d = map.locationPoint({
        lon: d.lon,
        lat: d.lat
    });
    return "translate(" + d.x + "," + d.y + ")";
}

function transformDestButton(d) {
    d = map.locationPoint({
        lon: d.lon,
        lat: d.lat
    });
    return "translate(" + d.x + "," + d.y + ")";
}

update();

d3.json("data/migrations.json", function(data) {
    showTransfers(data, 1000);
    drawSliderBar(data);
});


function drawSliderBar(data) {
    var tickFormat = d3.time.format("%Y");
    var timeFormat = d3.time.format("%Y");
    var width = 700;
    var height = 70;

    var timeScale = d3.time.scale()
        .domain([timeFormat.parse("2000"), timeFormat.parse("2014")])
        .range([0, 14]);

    var spaceScale = d3.time.scale()
        .domain(timeScale.domain())
        .range([50, width - 10]);


    var graph = d3.select("#axis").append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .append("svg:g")
        // .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
    var xAxis = d3.svg.axis()
        .scale(spaceScale)
        .ticks(d3.time.years, 1)
        .tickSize(10)
        .tickFormat(tickFormat)

    graph.append("svg:g")
        .attr("class", "x axis")
        .attr("width", width)
        .attr("height", height)
        // .attr("transform", "translate(0," + h + ")")
        .call(xAxis);


}



function showAllTransfers(data, transitionTime) {
    rScale.data = data;


    //////////////////////
    tableData = {
        headers: ["Source", "Destination", "$ (million)"],
        rows: []
    }

    data.forEach(function(d) {
        if (d.destinations) {
            d.destinations.sort(function(a, b) {
                return b.units - a.units
            })
            for (var j = 0; j < d.destinations.length; j++) {
                tableData.rows.push(
                    [d.name, d.destinations[j].name, d3NumberFormat(d.destinations[j].units).replace(/\B(?=(\d{3})+(?!\d))/g, ",")])
            }
        }
    })

    d3.select('div#table')
        .datum(tableData)
        .call(tableFunc)
        // $('#table')
        //   .mCustomScrollbar("destroy");
    $('#table')
        .mCustomScrollbar();
    //////////////////////
    var table = d3.select("div#table")
    table.selectAll("tbody tr")
        .on("mouseover", function(d, i) {

            pathGrow(d, i, "path.shippingPath", transitionTime);
        })
        .on("mouseout", function(d, i) {
            pathShrink(d, i, "path.shippingPath", transitionTime);
        })

    //////////////////////

    // Add an svg:g for each location.
    var marker = locsLayer.selectAll("circle")
        .data(data);

    marker.enter()
        .append("svg:circle")
        .attr('class', 'marker')
        .data(data)
        .attr("r", 0)
        .attr("transform", transform)
        .on("mouseover", function(d, i) {
            //console.log("grow0: ", d, this)
            grow(d, this, transitionTime);
            //Update the tooltip position and value
            var mouse = d3.mouse(this.parentNode);
            // get the offset with respect to the map's position on the document
            var offsetTop = d3.select('#map')
                .property('offsetTop')
            var offsetLeft = d3.select('#map')
                .property('offsetLeft')

            var tip = d3.select("#tooltip")
                .style("left", (offsetLeft + mouse[0]) + "px")
                .style("top", (offsetTop + mouse[1] + 20) + "px");
            tip.select("#value")
                .text(numberWithCommas.func(d));
            tip.select("#title")
                .text(d.name);
            //Show the tooltip
            d3.select("#tooltip")
                .classed("hidden", false);
        })
        .on("mouseout", function() {
            //Hide the tooltip
            d3.select("#tooltip")
                .classed("hidden", true);
        })
        .on("click", function(d, i) {
            hideLinks();
            makeFilterButtons(this, d, i);
        });

    // Add a circle.
    marker.append("svg:circle")
        .attr('class', 'marker')
        .data(data)
        .attr("r", 0);

    d3.selectAll("circle.marker")
        .transition()
        .duration(transitionTime)
        .delay(function(d, i) {
            return 10 * i
        })
        .attr("r", function(d) {
            return rScale.func(d) + 1
        })


    // Whenever the map moves, update the marker positions.
    map.on("move", update);
    map.on("resize", update);

    newData = [];
    newData.destinations = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].destinations) {
            data[i].destinations.forEach(function(d) {
                newDatum = d;
                newDatum.from = [data[i].lon, data[i].lat];
                newData.destinations.push(newDatum);
            })
        }
    }

    // console.log(newData)
    makeAllLinks(newData)
    setTimeout(function() {
        // makeSourceLinks(data[i], i)
        update();
    }, 1000);

    function makeAllLinks(d, i) {
        //////////////////////
        tableData = {
                headers: ["Source", "Destination", "$ (million)"],
                rows: []
            }
            // console.log(d)
        d.destinations.sort(function(a, b) {
            return b.units - a.units
        });
        //////////////////////


        // d3.selectAll('circle.marker')
        //   .transition()
        //   .duration(transitionTime / 1.5)
        //   .attr("r", 1);
        // // d3.select(this)
        // //     .transition()
        // //     .duration(700)
        // //     .attr("r", 10);


        var links = linksLayer.selectAll('path.shippingPath')
            .data(d.destinations)

        links.enter()
            .append('svg:path')
            .attr('class', 'shippingPath')

        links.exit()
            .remove();

        linksLayer.selectAll('path.shippingPath')
            .transition()
            .duration(transitionTime)
            .delay(function(d, i) {
                return 10 * i
            })
            .attr('d', function(d) {
                // d.from = from;
                return path(arc({
                    from: d.from,
                    to: [d.lon, d.lat]
                }))
            })
            .style("stroke-opacity", 0.5)
            .style("stroke-width", function(d) {
                return rScale.func(d)
            })
            .style("stroke", function(d) {
                return "#EA3556";
            })
            .style("fill", "none");



        //////////////////////////////////////////////////////                    
    }


}

function grow(d, e, transitionTime) {
    //    console.log(d,e)
    if (d3.selectAll('path.button')[0].length < 2) {

        var currentR = d3.select(e)
            .attr("r");
        //console.log("Grow1: currentR", currentR)

        d3.select(e)
            .transition()
            .duration(transitionTime / 2)
            .delay(0)
            .attr("r", function(d) {
                return rScale.func(d) + 1
            })
            .attr("fill", "#FFCA1B")
        d3.select(e)
            .transition()
            .duration(transitionTime / 2)
            .delay(500)
            .attr("r", rScale.func(d));
        //.attr("r", currentR);
    }
}

function showTransfers(data, transitionTime) {
    // Load the station data. When the data comes back, display it.
    //////////
    rScale.data = data;


    //////////////////////
    tableData = {
        headers: ["Source", "Destination", "$ (million)"],
        rows: [
            ["-", "-", "-"]
        ]
    }
    d3.select('div#table')
        .datum(tableData)
        .call(tableFunc)

    // Add an svg:g for each location.
    var marker = locsLayer.selectAll("circle")
        .data(data);

    marker.enter()
        .append("svg:circle")
        .attr('class', 'marker')
        .data(data)
        .attr("r", 0)
        .attr("transform", transform)
        .on("mouseover", function(d, i) {
            //console.log("grow0: ", d, this)
            grow(d, this, transitionTime);
            //Update the tooltip position and value
            var mouse = d3.mouse(this.parentNode);
            // get the offset with respect to the map's position on the document
            var offsetTop = d3.select('#map')
                .property('offsetTop')
            var offsetLeft = d3.select('#map')
                .property('offsetLeft')
            console.log("offsets: " + offsetTop + "\t" + offsetLeft)

            var tip = d3.select("#tooltip")
                .style("left", (+mouse[0] + 5) + "px")
                .style("top", (offsetTop + mouse[1] + 20) + "px");
            tip.select("#value")
                .text(numberWithCommas.func(d));
            tip.select("#title")
                .text(d.name);
            //Show the tooltip
            d3.select("#tooltip")
                .classed("hidden", false);
        })
        .on("mouseout", function() {
            //Hide the tooltip
            d3.select("#tooltip")
                .classed("hidden", true);
        })
        .on("click", function(d, i) {
            hideLinks();
            makeFilterButtons(this, d, i);
        });

    // Add a circle.
    marker.append("svg:circle")
        .attr('class', 'marker')
        .data(data)
        .attr("r", 0);

    d3.selectAll("circle.marker")
        .transition()
        .duration(transitionTime)
        .delay(function(d, i) {
            return 5 * i
        })
        .attr("r", function(d) {
            return rScale.func(d) + 1
        })


    // Whenever the map moves, update the marker positions.
    map.on("move", update);
    map.on("resize", update);



    function makeFilterButtons(f, d, i) {
        hideLinks();
        d3.selectAll('circle.marker')
            .transition()
            .duration(transitionTime / 1.5)
            .attr("r", 2);
        d3.select(f)
            .transition()
            .duration(transitionTime / 1.5)
            .attr("r", 10);

        var that = this;
        // data for the buttons
        d.buttons = [{
            type: function() {
                return 'Inbound'
            },
            lat: d.lat,
            lon: d.lon,
            source: true,
            name: d.name,
            units: function() {
                return {
                    units: d.units
                }
            },
            colour: "#0000FF",
            stroke: "black",
            clickfunct: function() {
                makeSourceLinks.call(that, d, i)
            },
            transformFunct: transformSourceButton,
            destinations: d.destinations,
            sources: d.sources,
            rFunct: function() {
                sum = d3.sum(d.sources, function(d) {
                    return parseFloat(d.units)
                })
                return sum;
            },
            startAngle: Math.PI,
            endAngle: (2 * Math.PI),
            sumSources: function() {
                if (!d.sources || d.sources.length < 1) {
                    return 0;
                }
                var sumUnits = d3.sum(d.sources, function(f) {
                    return parseFloat(f.units)
                })
                return {
                    units: sumUnits
                }
            }
        }, {
            type: function() {
                return 'Outbound'
            },
            lat: d.lat,
            lon: d.lon,
            source: true,
            name: d.name,
            units: function() {
                return {
                    units: d.units
                }
            },
            colour: "#F3F315",
            stroke: "black",
            clickfunct: function() {
                makeLinks.call(that, d, i)
            },
            transformFunct: transformDestButton,
            destinations: d.destinations,
            sources: d.sources,
            rFunct: function() {
                sum = d3.sum(d.destinations, function(d) {
                    return parseFloat(d.units)
                })
                return sum;
            },
            startAngle: 0,
            endAngle: Math.PI,
            sumDests: function() {
                var sumUnits = d3.sum(d.destinations, function(f) {
                    return parseFloat(f.units)
                })
                return {
                    units: sumUnits
                }
            }
        }];

        var buttonsLayer = d3.select("#map svg")
            .selectAll('g.buttons');
        var arc = d3.svg.arc()
            .innerRadius(10) //return rScale(d.units)})
            .outerRadius(function(d) {
                return (10 + outerRadiusScale.func(d)); //+ 2;
            })
            .startAngle(function(d) {
                return d.startAngle;
            })
            .endAngle(function(d) {
                return d.endAngle;
            })

        var path = buttonsLayer.selectAll("path.button")
            .data(d.buttons);
        path.enter()
            .append("svg:path")
            .attr("class", function(d) { //console.log(d)
                return "button " + d.type()
            })
            .attr("d", arc.outerRadius(10))
            .style("fill", function(d) {
                return d.colour
            })
            .style("opacity", 0.5)
            .style("stroke", "black")
            .style("stroke-opacity", 1)
            .style("stroke-width", 1)
            .attr("startAngle", (function(d) {
                if (d.type() == "Inbound") {
                    return (Math.PI)
                } else {
                    return (2 * Math.PI)
                }
            }))
            .attr("endAngle", function(d) {
                if (d.type() == "Outbound") {
                    return (180 * (Math.PI / 180))
                } else {
                    return 0
                }
            })
            // .attr("innerRadius", function (d) {return rScale(d.units)})
            // .attr("outerRadius", function (d) {
            //     //console.log("outerRadius should be: ", sumScale(d))
            //     return sumScale(d);
            // })
            // .attr("startAngle", function (d) {
            //     if (d.type="source") {return (180 * (Math.PI/180))}
            //         else {return 0}
            // })
            // .attr("endAngle", function (d) {
            //     if (d.type="dest") {return (180 * (Math.PI/180))}
            //         else {return 0}
            // })                    
            .attr("transform", function(d) {
                return d.transformFunct(d);
            })
            .on('click', function(d, i) {
                d.clickfunct();
            })
            .on("mouseover", function(d) {
                //Update the tooltip position and value
                var mouse = d3.mouse(this.parentNode);
                // get the offset with respect to the map's position on the document
                var offsetTop = d3.select('#map')
                    .property('offsetTop')
                var offsetLeft = d3.select('#map')
                    .property('offsetLeft')

                var tip = d3.select("#tooltip")
                    .style("left", (offsetLeft + mouse[0]) + "px")
                    .style("top", (offsetTop + mouse[1] + 20) + "px");
                tip.select("#value")
                    .text(function() {
                        //console.log(d)
                        if (d.type() == "Outbound") {
                            return numberWithCommas.func(d.sumDests())
                        } else if (d.type() == "Inbound") {
                            return numberWithCommas.func(d.sumSources())
                        }
                        return 0;
                    });
                tip.select("#title")
                    .text(function() {
                        return d.type()
                    });
                //Show the tooltip
                d3.select("#tooltip")
                    .classed("hidden", false)
                    .classed("dest", true);
            })
            .on("mouseout", function() {
                //Hide the tooltip
                d3.select("#tooltip")
                    .classed("hidden", true)
                    .classed("dest", false);
            })
            .transition()
            .duration(transitionTime)
            .attr("d", arc.outerRadius(function(d) {
                return (10 + outerRadiusScale.func(d)); //+ 2;
            }))

        path.exit()
            .remove();

        ////////////////////////////////////////////////////////
        var backButton = [];
        backButton.push({
            lat: d.lat,
            lon: d.lon,
            source: true,
            name: d.name,
            units: d.units
        });
        buttonsLayer.selectAll("circle")
            //.data([32, 57, 112, 293])
            .data(backButton)
            .enter()
            .append("circle")
            .attr("class", "buttons")
            .attr("transform", function(d) {
                if (d) {
                    return transform(d);
                }
            })
            .attr("opacity", 0)
            .attr("r", 10)
            .on("mouseover", function(d, i) {
                var mouse = d3.mouse(this.parentNode);
                // get the offset with respect to the map's position on the document
                var offsetTop = d3.select('#map')
                    .property('offsetTop')
                var offsetLeft = d3.select('#map')
                    .property('offsetLeft')

                var tip = d3.select("#tooltip")
                    .style("left", (offsetLeft + mouse[0]) + "px")
                    .style("top", (offsetTop + mouse[1] + 20) + "px");
                tip.select("#value")
                    .text(numberWithCommas.func(d));
                tip.select("#title")
                    .text(d.name);
                //Show the tooltip
                d3.select("#tooltip")
                    .classed("hidden", false);
            })
            .on("mouseout", function() {
                //Hide the tooltip
                d3.select("#tooltip")
                    .classed("hidden", true);
            })
            .on('click', function() {
                //console.log("click 2");
                //console.log("current R: ", d3.select(this).attr("r"));
                //console.log(this)
                hideLinks();

            });

        //////////////////////////////////////////////////////
    }

    function sumScale(d) {
        r = 0;
        sumDests = d3.sum(d.destinations, function(f) {
            return parseFloat(f.units)
        });
        sumSources = 0;
        maxNum = 0;
        if (d.type() == "Inbound" && !d.sources) {
            return 0

        }
        if (d.sources) {
            sumSources = d3.sum(d.sources, function(f) {
                return parseFloat(f.units)
            });
            maxNum = Math.max(sumDests, sumSources);

        }
        maxNum = Math.max(sumDests, sumSources);
        markerR = rScale.func(d)
            //console.log(markerR)
        var scale = d3.scale.linear()
            .range([1, markerR])
            .domain([1, maxNum])
            .clamp("true");
        //console.log(d.type, maxNum )
        if (d.type() == "Inbound") {
            //console.log("sumSources", sumSources)
            r = scale(sumSources)
        } else {
            //console.log("sumDests", sumDests)                    
            r = scale(sumDests)
        }
        //console.log("R", r)
        return r


    }

    var outerRadiusScale = {
        func: function(d) {
            r = 0;
            sumDests = 0;
            if (d.destinations) {
            sumDests = d3.sum(d.destinations, function(f) {
                return parseFloat(f.units)
            });
            }
            sumSources = 0;
            maxNum = 0;
            if (d.type() == "Inbound" && !d.sources) {
                return 1;
            }
            if (d.sources) {
                sumSources = d3.sum(d.sources, function(f) {
                    return parseFloat(f.units)
                });
                maxNum = Math.max(sumDests, sumSources);

            }

            maxNum = Math.max(sumDests, sumSources);
            markerR = rScale.func(d.units())
            var scale = d3.scale.linear()
                .range([1, markerR])
                .domain([1, maxNum])
                .clamp("true");
            if (d.type() == "Inbound") {
                r = scale(sumSources)
            } else {
                r = scale(sumDests)
            }
            return r;
        }
    }

    function makeLinks(d, i) {
        //////////////////////
        tableData = {
            headers: ["Source", "Destination", "$ (million)"],
            rows: []
        }
        console.log(d)
        d.destinations.sort(function(a, b) {
            return b.units - a.units
        })
        for (var j = 0; j < d.destinations.length; j++) {

            tableData.rows.push(
                [d.name, d.destinations[j].name, d3NumberFormat(d.destinations[j].units).replace(/\B(?=(\d{3})+(?!\d))/g, ",")])
        }
        d3.select('div#table')
            .datum(tableData)
            .call(tableFunc)
            // $('#table')
            //   .mCustomScrollbar("destroy");
        $('#table')
            .mCustomScrollbar();
        //////////////////////
        var table = d3.select("div#table")
        table.selectAll("tbody tr")
            .on("mouseover", function(d, i) {

                pathGrow(d, i, "path.shippingPath", transitionTime);
            })
            .on("mouseout", function(d, i) {
                pathShrink(d, i, "path.shippingPath", transitionTime);
            })

        //////////////////////


        d3.selectAll('circle.marker')
            .transition()
            .duration(transitionTime / 1.5)
            .attr("r", 1);
        // d3.select(this)
        //     .transition()
        //     .duration(700)
        //     .attr("r", 10);

        var from = [d.lon, d.lat];

        var links = linksLayer.selectAll('path.shippingPath')
            .data(d.destinations)

        links.enter()
            .append('svg:path')
            .attr('class', 'shippingPath')

        links.exit()
            .remove();

        linksLayer.selectAll('path.shippingPath')
            .transition()
            .duration(transitionTime)
            .delay(function(d, i) {
                return 10 * i
            })
            .attr('d', function(d) {
                d.from = from;
                return path(arc({
                    from: from,
                    to: [d.lon, d.lat]
                }))
            })
            .style("stroke-opacity", 0.5)
            .style("stroke-width", function(d) {
                return rScale.func(d)
            })
            .style("stroke", function(d) {
                return "#EA3556";
            })
            .style("fill", "none");

        // d.destinations.push({
        //     lat: d.lat,
        //     lon: d.lon,
        //     source: true,
        //     name: d.name,
        //     units: d.units
        // })
        var destinationsLayer = d3.select("#map svg")
            .selectAll('g.destinations');



        var destination = destinationsLayer.selectAll("circle.destination")
            .data(d.destinations);
        destination.enter()
            .append("svg:circle")
            .attr("class", "destination")
        destination.exit()
            .remove();



        destinationsLayer.selectAll('circle.destination')
            .attr("transform", function(d) {
                if (d) {
                    return transform(d);
                }
            })
            .style("fill", "none")
            .style("stroke-opacity", 0.5)
            .transition()
            .duration(transitionTime / 1.5)
            .attr("r", function(d) {

                if (d === null) return 3
                else {
                    return rScale.func(d)
                }
            })
            .style("stroke", function(d) {
                return "#F00";
            })
            .style("fill", function(d) {
                if (d === null) return 'yellow'
                if (d.source) return "#081D41"
                return "yellow"
            })

        destinationsLayer.selectAll('circle.destination')
            .on("mouseover", function(d) {
                growDS(d, this, data, transitionTime);
                //Update the tooltip position and value
                var mouse = d3.mouse(this.parentNode);
                // get the offset with respect to the map's position on the document
                var offsetTop = d3.select('#map')
                    .property('offsetTop')
                var offsetLeft = d3.select('#map')
                    .property('offsetLeft')

                var tip = d3.select("#tooltip")
                    .style("left", (offsetLeft + mouse[0]) + "px")
                    .style("top", (offsetTop + mouse[1] + 20) + "px");
                tip.select("#value")
                    .text(numberWithCommas.func(d));
                tip.select("#title")
                    .text(d.name);
                //Show the tooltip
                d3.select("#tooltip")
                    .classed("hidden", false)
                    .classed("dest", true);
            })
            .on("mouseout", function() {
                //Hide the tooltip
                d3.select("#tooltip")
                    .classed("hidden", true)
                    .classed("dest", false);
            })
            .on('click', hideLinks);

        // // add click functionality to the last one
        // var circles = d3.selectAll('circle.destination')[0]
        // d3.select(circles[circles.length - 1])
        //     .on('click', hideLinks);
        ////////////////////////////////////////////////////////
        var backButton = [];
        backButton.push({
            lat: d.lat,
            lon: d.lon,
            source: true,
            name: d.name,
            units: d.units
        });
        buttonsLayer.selectAll("circle")
            //.data([32, 57, 112, 293])
            .data(backButton)
            .enter()
            .append("circle")
            .attr("class", "buttons " + "marker")
            .attr("transform", function(d) {
                if (d) {
                    return transform(d);
                }
            })
            .attr("opacity", 0)
            .attr("r", 10)
            .on("mouseover", function(d, i) {
                var mouse = d3.mouse(this.parentNode);
                // get the offset with respect to the map's position on the document
                var offsetTop = d3.select('#map')
                    .property('offsetTop')
                var offsetLeft = d3.select('#map')
                    .property('offsetLeft')

                var tip = d3.select("#tooltip")
                    .style("left", (offsetLeft + mouse[0]) + "px")
                    .style("top", (offsetTop + mouse[1] + 20) + "px");
                tip.select("#value")
                    .text(numberWithCommas.func(d));
                tip.select("#title")
                    .text(d.name);
                //Show the tooltip
                d3.select("#tooltip")
                    .classed("hidden", false);
            })
            .on("mouseout", function() {
                //Hide the tooltip
                d3.select("#tooltip")
                    .classed("hidden", true);
            })
            .on('click', function() {
                //console.log("Click 1")
                hideLinks();



            });

        //////////////////////////////////////////////////////                    
    }



    // function shrink(d, i) {
    //     d3.select(this)
    //         .transition()
    //         .duration(500)
    //         .delay(3 * i)
    //         .attr("r", function (d) {
    //         return rScale(d.units)
    //     })

    // }

    function makeSourceLinks(d, i) {
        if (!d.sources) {
            return;
        }
        //////////////////////
        tableData = {
                headers: ["Source", "Destination", "$ (million)"],
                rows: []
            }
            //console.log(d)
        d.sources.sort(function(a, b) {
            return b.units - a.units
        })
        for (var i = 0; i < d.sources.length; i++) {
            tableData.rows.push(
                [d.sources[i].name, d.name, d3NumberFormat(d.sources[i].units).replace(/\B(?=(\d{3})+(?!\d))/g, ",")])
        }
        d3.select('div#table')
            .datum(tableData)
            .call(tableFunc)
            // $('#table')
            //    .mCustomScrollbar("destroy");
        $('#table')
            .mCustomScrollbar();

        var table = d3.select("div#table")
        table.selectAll("tbody tr")
            //   .attr("onclick", function(d) {
            //    // console.log(d);
            //     makeInefLinks(d, excessUnitMilesList);
            // })
            .on("mouseover", function(d, i) {
                // console.log(d);
                // console.log(d, i, "path.shippingPath", data)

                pathGrow(d, i, "path.shippingPath");
            })
            .on("mouseout", function(d, i) {
                // console.log(d);
                // console.log(d, i, "path.shippingPath", data)

                pathShrink(d, i, "path.shippingPath", "#207836");
            })

        //////////////////////
        //console.log(d)

        d3.selectAll('circle.marker')
            .transition()
            .duration(transitionTime / 1.5)
            .attr("r", 1);
        // d3.select(this)
        //     .transition()
        //     .duration(700)
        //     .attr("r", 10);

        var from = [d.lon, d.lat];

        var links = linksLayer.selectAll('path.shippingPath')
            .data(d.sources)

        links.enter()
            .append('svg:path')
            .attr('class', 'shippingPath')

        links.exit()
            .remove();

        linksLayer.selectAll('path.shippingPath')
            .transition()
            .duration(transitionTime)
            .delay(function(d, i) {
                return 10 * i
            })
            .attr('d', function(d) {
                d.from = from;
                return path(arc({
                    from: from,
                    to: [d.lon, d.lat]
                }))
            })
            .style("stroke-opacity", 0.5)
            .style("stroke-width", function(d) {
                return rScale.func(d)
            })
            .style("stroke", function(d) {
                return "#5EFFA9";
            })
            .style("fill", "none");

        // d.sources.push({
        //     lat: d.lat,
        //     lon: d.lon,
        //     source: true,
        //     name: d.name,
        //     units: d.units
        // })
        var sourcesLayer = d3.select("#map svg")
            .selectAll('g.sources');



        var source = sourcesLayer.selectAll("circle.source")
            .data(d.sources);
        source.enter()
            .append("svg:circle")
            .attr("class", "source")
        source.exit()
            .remove();



        sourcesLayer.selectAll('circle.source')
            .attr("transform", function(d) {
                if (d) {
                    return transform(d);
                }
            })
            .style("fill", "none")
            .style("stroke-opacity", 0.5)
            .transition()
            .duration(transitionTime / 1.5)
            .attr("r", function(d) {
                //console.log(rScale(d.units))
                return rScale.func(d)
            })
            .style("stroke", function(d) {
                return "#D80DFC";
            })
            .style("fill", function(d) {
                if (d === null) return '0D75FC'
                if (d.source) return "#0D75FC"
                return "0D75FC"
            })
        sourcesLayer.selectAll('circle.source')
            .on("mouseover", function(d) {
                growDS(d, this, data, transitionTime);

                //Update the tooltip position and value
                var mouse = d3.mouse(this.parentNode);
                // get the offset with respect to the map's position on the document
                var offsetTop = d3.select('#map')
                    .property('offsetTop')
                var offsetLeft = d3.select('#map')
                    .property('offsetLeft')

                var tip = d3.select("#tooltip")
                    .style("left", (offsetLeft + mouse[0]) + "px")
                    .style("top", (offsetTop + mouse[1] + 20) + "px");
                tip.select("#value")
                    .text(numberWithCommas.func(d));
                tip.select("#title")
                    .text(d.name);
                //Show the tooltip
                d3.select("#tooltip")
                    .classed("hidden", false)
                    .classed("dest", true);
            })
            .on("mouseout", function() {
                //Hide the tooltip
                d3.select("#tooltip")
                    .classed("hidden", true)
                    .classed("dest", false);
            })
            .on('click', hideLinks);

        // // add click functionality to the last one
        // var circles = d3.selectAll('circle.source')[0]
        // d3.select(circles[circles.length - 1])
        //     .on('click', hideLinks);

        ////////////////////////////////////////////////////////
        var backButton = [];
        backButton.push({
            lat: d.lat,
            lon: d.lon,
            source: true,
            name: d.name,
            units: d.units
        });
        buttonsLayer.selectAll("circle")
            //.data([32, 57, 112, 293])
            .data(backButton)
            .enter()
            .append("circle")
            .attr("class", "buttons " + "marker")
            .attr("transform", function(d) {
                if (d) {
                    return transform(d);
                }
            })
            .attr("opacity", 0)
            .attr("r", 10)
            .on("mouseover", function(d, i) {
                var mouse = d3.mouse(this.parentNode);
                // get the offset with respect to the map's position on the document
                var offsetTop = d3.select('#map')
                    .property('offsetTop')
                var offsetLeft = d3.select('#map')
                    .property('offsetLeft')

                var tip = d3.select("#tooltip")
                    .style("left", (offsetLeft + mouse[0]) + "px")
                    .style("top", (offsetTop + mouse[1] + 20) + "px");
                tip.select("#value")
                    .text(numberWithCommas.func(d));
                tip.select("#title")
                    .text(d.name);
                //Show the tooltip
                d3.select("#tooltip")
                    .classed("hidden", false);
            })
            .on("mouseout", function() {
                //Hide the tooltip
                d3.select("#tooltip")
                    .classed("hidden", true);
            })
            .on('click', function() {
                hideLinks();
            });

        //////////////////////////////////////////////////////                    

    }

}

var d3NumberFormat = d3.format(".3r");
var numberWithCommas = {
    shipmentsFlag: false,
    func: function(d) {
        if (numberWithCommas.shipmentsFlag == true) {
            return parseFloat(d.shipments)
                .toPrecision(3)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return d3NumberFormat(parseFloat(d.units))
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },
    miles: function(d) {
        return parseFloat(d)
            .toFixed(0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}