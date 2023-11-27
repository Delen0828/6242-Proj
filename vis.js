

// Set the dimensions of the chart
var margin = { top: 20, right: 30, bottom: 30, left: 40 };
var linewidth = 320 - margin.left - margin.right;
var lineheight = 240 - margin.top - margin.bottom;
var linesvg = d3.select("#vis-container")
	.append("svg")
	.attr("width", linewidth + margin.left + margin.right)
	.attr("height", lineheight + margin.top + margin.bottom)
	.style("background", "#fcfaed")
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Scale functions
var xScale = d3.scaleLinear().range([0, linewidth]);
var yScale = d3.scaleLinear().range([lineheight, 0]);
// Append the line to the chart
var line = d3.line()
	.x(function (d) { return xScale(d.round); })
	.y(function (d) { return yScale(d.value); });

// Append the x-axis
linesvg.append("g")
	.attr("class", "x-axis")
	.attr("transform", "translate(0," + lineheight + ")")
	.call(d3.axisBottom(xScale));

// Append the y-axis
linesvg.append("g")
	.attr("class", "y-axis")
	.call(d3.axisLeft(yScale));

linesvg.append("text")
   .attr("class", "x-axis-label")
   .attr("x", linewidth / 2)
   .attr("y", lineheight + 27) // Adjust the Y-position for label
   .style("text-anchor", "middle")
   .style("font-size", "12px")
   .text("Round");

// Add Y-axis label
linesvg.append("text")
   .attr("class", "y-axis-label")
   .attr("transform", "rotate(-90)")
   .attr("x", -lineheight / 2)
   .attr("y", -30) // Adjust the Y-position for label
   .style("text-anchor", "middle")
   .style("font-size", "12px")
   .text("Avg. Feedback");
// linesvg.append("path")
// 	.data([{ "round": 0, "value": 0 }, { "round": 10, "value": 0 }])
// 	.attr("class", "line")
// 	.attr("fill", "none")
// 	.attr("stroke", "steelblue")
// 	.attr("stroke-width", 1.5)
// 	.attr("d", line);
// plt_data = [{ "round": 0, "value": 0 }]

function draw(plt_data, comp_data, comp_algo) {
	xScale.domain([0, d3.max(plt_data, function (d) { return d.round; })]);
	yScale.domain([0, d3.max(plt_data, function (d) { return d.value; })]);
	linesvg.selectAll("path").remove()
	linesvg.selectAll("g").remove()
	linesvg.append("g")
		.attr("class", "x-axis")
		.attr("transform", "translate(0," + lineheight + ")")
		.call(d3.axisBottom(xScale));
	linesvg.append("g")
		.attr("class", "y-axis")
		.call(d3.axisLeft(yScale));
	linesvg.append("path")
		.data([plt_data])
		.attr("class", "line")
		.attr("fill", "none")
		.attr("stroke", "coral")
		.attr("stroke-width", 2)
		.attr("d", line);
	// console.log(comp_algo)
	if (comp_algo != 'None') {
		linesvg.append("path")
			.data([comp_data])
			.attr("class", "line")
			.attr("fill", "none")
			.attr("stroke", "steelblue")
			.attr("stroke-width", 2)
			.attr("d", line);
	}
}

document.getElementById('simButton').addEventListener('mouseup', function () { draw(regret_history, comp_regret_history, comp_algo) });
document.getElementById('likeButton').addEventListener('mouseup', function () { draw(regret_history, comp_regret_history, comp_algo) });
document.getElementById('dislikeButton').addEventListener('mouseup', function () { draw(regret_history, comp_regret_history, comp_algo) });

sr.reveal('#vis-container', { delay: 10, origin: 'top' });
sr.reveal('.algo-sel', { delay: 10, origin: 'top' });