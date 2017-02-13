console.log("Starting a d3 experiment");

d3.select("body").style("background-color", "white");
var w = 1000,
		h = 1000;

//append svg to div#line
var svg = d3.select("#line")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
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
	draw();
}

function draw() {
	var line = 	d3.line()
								.x(function(d, i) { console.log("i:" + i); return d.x;  })
								.y(function(d, i) { return d.y; });

	var path = svg.data(coordinates)
		// .enter()
		.append("path")
	  .attr("d", function(d, i) { return line([
      {
        "station": "RICH", 
        "x": 333, 
        "y": 120 
      },
      {
        "station": "DELN", 
        "x": 344, 
        "y": 142 
      },
      ]); }) // move to [0], lineto [1]
	  .attr("stroke", "steelblue")
	  .attr("stroke-width", function(d) { return 2; })
	  .attr("fill", "none");
/*
select svg
bind data (two objects) from data array
enter remaining data
append path

*/

	// var totalLength = path.node().getTotalLength();

	// path
	//   .attr("stroke-dasharray", totalLength + " " + totalLength)
	//   .attr("stroke-dashoffset", totalLength)
	//   .transition()
	//     .duration(40000)
	//     .ease(d3.easeLinear)
	//     .attr("stroke-dashoffset", 0);
}
