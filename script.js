console.log("Starting a d3 experiment");

d3.select("body").style("background-color", "white");

//append svg to div#line
var svg = d3.select("#line")
  .append("svg")
  .attr("width", 1000)
  .attr("height", 1000)
  .attr("id", "visualization")
  .attr("xmlns", "http://www.w3.org/2000/svg");

var coordinates;
var riders;
var error;

queue()
    .defer(d3.json, "coordinates.json")
    .defer(d3.json, "riders.json")
    .await(ready);

function ready(error, coordinatesJSON, ridersJSON) {
  error = error;
  coordinates = coordinatesJSON;
  riders = ridersJSON;
  console.log("coordinates: " + JSON.stringify(coordinates));
  massage();
  draw();
}

function massage() {
  var h = 0;
  // filter ridership data to only trips on a specific line (red, blue, green, etc)
  var redLineRiders = riders.filter(isOnRed);
  // filter ridership data to direction NB or SB
  var redLineRidersSouthBound = redLineRiders.filter(isSouthBound);
  var trips = redLineRidersSouthBound.filter(tripsHour(h));

  function matchTrip(origin, dest, t) {
    return t.origin == origin && t.dest == dest;
  }

  function isSouthBound(t) {
    // assumes coordinate data is always listed north to south
    return getStationIndex(coordinates, t.origin) < getStationIndex(coordinates, t.dest);
  }

  function getStationIndex(line, station) {
    var i = line.map(function(e) {
      return e.station;
    }).indexOf(station);
    return i;
  }

  function isOnRed(t) {
    // is trip object t's origin  == to any of coordinates's stations?
    for (var i = 0; i < coordinates.length; i++) {
      if (t.origin == coordinates[i].station) {
        for (var i = 0; i < coordinates.length; i++) {
          if (t.dest == coordinates[i].station) {
            return true;
          }
        }
      }
    }
  }

  // sum all riders that board at an origin station that's on a specific line
  function sumBoard (line, origin) {
    var ridersCount = line.reduce(function(sum, x) {
      if (x.origin == origin) {
        return sum + x.riders;
      }
      return sum;
    }, 1);
    return ridersCount;
  }

  // for a set of trips, sum all riders that exit at a specified dest station
  function sumExits (trips, dest) {
    var ridersCount = trips.reduce(function(sum, x) {
      if (x.dest == dest) {
        return sum + x.riders;
      }
      return sum;
    }, 1);
    return ridersCount;
  }

  //filter function to return only trips of a requested hour
  function tripsHour(hour) {
    return function(t) {
      return t.hour == hour;
    }
  }
}

function draw() {
  console.log("draw");
  var line =  d3.line()
    .x(function(d) { return d.x;  })
    .y(function(d) { return d.y; });

  var circles = d3.select("svg").selectAll("circle")
    .data(coordinates)
    .enter()
    .append("circle")
    .attr("cx", function(d, i) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    })
    .attr("r", 2)
    .attr("fill", "steelblue");

  var temp = [];
  var time = 0;
  var totalTime = 0;
  var h = 0;
  // filter ridership data to only trips on a specific line (red, blue, green, etc)
  var redLineRiders = riders.filter(isOnRed);
  // filter ridership data to direction NB or SB
  var redLineRidersSouthBound = redLineRiders.filter(isSouthBound);
  var trips = redLineRidersSouthBound.filter(tripsHour(h));

  function matchTrip(origin, dest, t) {
    return t.origin == origin && t.dest == dest;
  }

  function isSouthBound(t) {
    // assumes coordinate data is always listed north to south
    return getStationIndex(coordinates, t.origin) < getStationIndex(coordinates, t.dest);
  }

  function getStationIndex(line, station) {
    var i = line.map(function(e) {
      return e.station;
    }).indexOf(station);
    return i;
  }

  function isOnRed(t) {
    // is trip object t's origin  == to any of coordinates's stations?
    for (var i = 0; i < coordinates.length; i++) {
      if (t.origin == coordinates[i].station) {
        for (var i = 0; i < coordinates.length; i++) {
          if (t.dest == coordinates[i].station) {
            return true;
          }
        }
      }
    }
  }

  // sum all riders that board at an origin station that's on a specific line
  function sumBoard (line, origin) {
    var ridersCount = line.reduce(function(sum, x) {
      if (x.origin == origin) {
        return sum + x.riders;
      }
      return sum;
    }, 1);
    return ridersCount;
  }

  // for a set of trips, sum all riders that exit at a specified dest station
  function sumExits (trips, dest) {
    var ridersCount = trips.reduce(function(sum, x) {
      if (x.dest == dest) {
        return sum + x.riders;
      }
      return sum;
    }, 1);
    return ridersCount;
  }

  //filter function to return only trips of a requested hour
  function tripsHour(hour) {
    return function(t) {
      return t.hour == hour;
    }
  }
  for(var i = 0; i < coordinates.length - 1; ++i) {
    temp[0] = coordinates[i];
    temp[1] = coordinates[i+1];
    time = 1000;
    var origin = temp[0].station;
    var dest = temp[1].station;
    var trainLoad = 0;

    var paths = svg.append("path")
      .attr("d", line(temp))
      .attr("stroke", "steelblue")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", function(d, index) { 
        // return ridership data for each path

        console.log(sumBoard(trips, origin));
        trainLoad += sumBoard(trips, origin);
        trainLoad -= sumExits(trips, dest);
        console.log("trainLoad: " + trainLoad);
        return trainLoad / 100;
      })
      .attr("fill", "none");

    var totalLength = paths.node().getTotalLength();

    paths.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .delay(totalTime)
        .duration(time)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

    totalTime += time;

  }
}
