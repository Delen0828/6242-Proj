const n_node = 5;
// Dimensions for the SVG container
const width = 600, height = 300;
const total_time = { value: 0.0 };
const nodesData = Array.from({ length: n_node }, (_, i) => ({ id: i, value: 0.0, time: 0.0, color: 'lightblue', text: 'text' }));
// Create SVG container
const svg = d3.select("#d3-container").append("svg")
	.attr("width", width)
	.attr("height", height)
	.style("background", "#fcfaed");
const total_regret = { value: 0.0 };
let regret_history = [];
nodes = d3_plot(nodesData);
text_plot(nodes);


async function load_yelp() {
	const review_data = await fetch('./yelp_dataset/review.json');
	const review_json = await review_data.json();
	const yelp_review = await Object.entries(review_json).slice(0, n_node);
	return yelp_review
	// console.log(keyValueArray[0][0])
}

async function get_name() {
	yelp_review = await load_yelp();
	let textData = Array.from({ length: n_node }, (_, i) => ({ id: i, text: yelp_review[i][0] }));
	return textData
}
async function get_review() {
	yelp_review = await load_yelp();
	let reviewData = Array.from({ length: n_node }, (_, i) => ({ id: i, review: yelp_review[i][1] }));
	return reviewData
}
async function text_plot(node) {
	textData = await get_name()
	node.append("text")
		.data(textData)
		.attr("class", "node-title")
		.attr("y", 40)
		.attr("text-anchor", "middle")
		.text(d => d.text.substring(0, 15));
}
function d3_plot() {
	// const nodesData = await get_node();
	const node = svg.selectAll(".node")
		.data(nodesData)
		.enter().append("g")
		.attr("class", "node")
		.attr("transform", (d, i) => `translate(${100 + i * 100},${height / 2})`);
	// .on("click", (d) => { // Event listener for node clicks
	// 	updateNodes(total_time,d.id)
	// 	updateLabels();});
	drawNodes(node);
	// Add labels to nodes

	return node
}



// Function to update node values
async function updateNodes(total_round, feedback = true, is_sim = false) {

	reviewData = await get_review();
	const repeat = document.getElementById("simSelect").value;
	// console.log(repeat)
	const algo = document.getElementById("algoSelect").value;
	const m_ETC = 5;
	for (var j = 0; j < repeat; j++) {
		var maxValue = nodesData[0].value;
		var maxIndex = 0;
		for (var i = 0; i < nodesData.length; i++) {
			nodesData[i].color = 'lightblue';
			if (nodesData[i].value > maxValue) {
				maxValue = nodesData[i].value;
				maxIndex = i;
			}
		}
		nodesData[maxIndex].color = 'coral';
		// console.log(nodesData[maxIndex]);
		if (is_sim == false) {
			nodesData[maxIndex].time += feedback;
		}
		else {
			var temp_len = reviewData[maxIndex]['review'].length;
			feedback = reviewData[maxIndex]['review'][total_round.value % temp_len]
			nodesData[maxIndex].time += feedback;
			// console.log(reviewData[maxIndex]['review'][total_round.value % temp_len])
		}
		total_round.value += 1;
		for (var i = 0; i < nodesData.length; i++) {
			var temp = 0;
			if (algo == 'UCB') { temp = Math.floor((nodesData[i].time / total_round.value + 0.5 * Math.sqrt(2.0 * Math.log(total_round.value) / (nodesData[i].time + 1))) * 100) / 100; }
			if (algo == 'Random') { temp = Math.floor(Math.random() * 100) / 100 }
			if (algo == 'ETC') {
				if (total_round.value < n_node * m_ETC) {
					temp = Math.floor(Math.random() * 100) / 100
				}
				else { temp = Math.floor((nodesData[i].time / total_round.value)*100)/100 }
			}
			console.log();
			nodesData[i].value = temp;
		}
		total_regret.value += 1 - feedback;
		regret_history.push({ "round": total_time.value, "value": total_regret.value })
		// console.log(total_regret)
		// Update labels
		updateLabels();
		if (is_sim == false) { break; }
	}
}

// Function to update labels
async function updateLabels() {
	// console.log(nodesData)
	drawNodes(nodes)
	svg.selectAll(".label")
		.data(nodesData)
		.text(d => d.value);
}

async function drawNodes(node) {
	node.append("circle")
		.attr("r", 20)
		.attr("fill", d => d.color);
	node.append("text")
		.attr("class", "label")
		.attr("y", 5)
		.attr("text-anchor", "middle")
		.text(d => d.value);
}

// Event listener for the button
document.getElementById('likeButton').addEventListener('mousedown', function () { updateNodes(total_time, feedback = true) });
document.getElementById('dislikeButton').addEventListener('mousedown', function () { updateNodes(total_time, feedback = false) });
document.getElementById('simButton').addEventListener('mousedown', function () { updateNodes(total_time, feedback = true, is_sim = true) });

const sr = ScrollReveal({
	distance: '65px',
	duration: 2600,
	delay: 450,
	reset: true
});


sr.reveal('#d3-container', { delay: 10, origin: 'top' });
sr.reveal('.button1', { delay: 200, origin: 'top' });