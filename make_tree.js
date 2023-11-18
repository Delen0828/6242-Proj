var data = {
	name: "Parent", value: 'User',
	children: [
		{ name: "Child 1", value: 0 },
		{ name: "Child 2", value: 0 },
		{ name: "Child 3", value: 0 },
		{ name: "Child 4", value: 0 },
		{ name: "Child 5", value: 0 }]
};

var treeLayout = d3.tree().size([400, 200]);

var rootNode = d3.hierarchy(data);
var treeData = treeLayout(rootNode);

var svg = d3.select("svg");
var links = svg.selectAll(".link")
	.data(treeData.links())
	.enter()
	.append("path")
	.attr("class", "link")
	.attr("d", d3.linkVertical()
		.x(function (d) { return d.x; })
		.y(function (d) { return d.y + 20; })
	);

var nodes = svg.selectAll(".node")
	.data(treeData.descendants())
	.enter()
	.append("circle")
	.attr("class", "node")
	.attr("cx", function (d) { return d.x; })
	.attr("cy", function (d) { return d.y + 20; })
	.attr("r", 5);

svg.selectAll("text")
	.data(treeData.descendants())
	.enter()
	.append("text")
	.text(function (d) { return d.data.value; })
	.attr("x", function (d) { return d.x + 10; })
	.attr("y", function (d) { return d.y + 20; });



const submitButton = document.getElementById('submitButton');
// const resultTextbox = document.getElementById('resultTextbox');

submitButton.addEventListener('click', function () {
	// const return_value

	var svg = d3.select("svg");

	console.log(1);
	svg.selectAll("text")
		.data(treeData.descendants())
		.enter()
		.append("text")
		.text(function (d) { return d.data.value + 1; })
		.attr("x", function (d) { return d.x + 20; })
		.attr("y", function (d) { return d.y + 30; });

})


