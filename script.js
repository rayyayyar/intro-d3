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
	console.log("draw");
	var line = 	d3.line()
								.x(function(d, i) { console.log("i:" + i); return d.x;  })
								.y(function(d, i) { return d.y; });

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

var paths = d3.select("svg").selectAll("path")
		.data(coordinates)
		.enter()
		.append("path")
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-width", function(d, i) { return Math.random() * i });

	
	paths.attr("d", function(d, i) { if (i <=  paths.data().length - 2) { return line(segmentData(i)); } })

	function segmentData(i) {
		
			var pair = [{"x": paths.data()[i].x, "y": paths.data()[i].y}, {"x": paths.data()[i+1].x, "y": paths.data()[i+1].y}];
			return pair;
		
	}

	// attempt animation
	// var totalLength = paths.node().getTotalLength();

	// paths
	//   .attr("stroke-dasharray", totalLength + " " + totalLength)
	//   .attr("stroke-dashoffset", totalLength)
	//   .transition()
	//     .duration(1000)
	//     .ease(d3.easeLinear)
	//     .attr("stroke-dashoffset", 0);


}

