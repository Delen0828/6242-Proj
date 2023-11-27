const n_node = 5;
// Dimensions for the SVG container
const width = 600, height = 450;
const total_time = { value: 0.0 };
const nodesData = Array.from({ length: n_node }, (_, i) => ({ id: i, value: 0.0, time: 0.0, color: 'lightblue', text: 'text', comp_value: 0.0, comp_time: 0.0 }));
// Create SVG container
const svg = d3.select("#d3-container").append("svg")
	.attr("width", width)
	.attr("height", height)
	.style("background", "#fcfaed");
const total_regret = { value: 0.0 };
const comp_total_regret = { value: 0.0 };
let regret_history = [];
let comp_regret_history = [];
const mapping = rand_map(n_node, 100000)
// console.log(mapping)
nodes = d3_plot(nodesData);
text_plot(nodes);

function rand_map(n_node, total_len) {
	var rlist = [];
	for (i = 0; i < n_node; i++) {
		rlist.push(Math.floor(Math.random() * total_len));
	}
	return [9, 10, 11, 14, 15]
}

async function load_yelp() {
	const review_data = await fetch('./yelp_dataset/review.json');
	const review_json = await review_data.json();
	const yelp_review = await Object.entries(review_json);
	return yelp_review
	// console.log(keyValueArray[0][0])
}

async function get_name(mapping) {
	yelp_review = await load_yelp();
	let textData = Array.from({ length: n_node }, (_, i) => ({ id: i, text: yelp_review[mapping[i]][0] }));
	// console.log(mapping[0], mapping[1], mapping[2], mapping[3], mapping[4]);
	return textData
}
async function get_review(mapping) {
	if (total_time.value == 0) { yelp_review = await load_yelp(); }
	let reviewData = Array.from({ length: n_node }, (_, i) => ({ id: i, review: yelp_review[mapping[i]][1] }));
	// console.log(reviewData);
	return reviewData
}
async function text_plot(node) {
	// console.log(total_time.value)
	if (total_time.value == 0) { textData = await get_name(mapping); }
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
async function updateNodes(total_round, algo, algo_comp, feedback, is_sim) {

	reviewData = await get_review(mapping);
	const repeat = document.getElementById("simSelect").value;
	// console.log(repeat)


	for (var j = 0; j < repeat; j++) {
		var maxValue = nodesData[0].value;
		var maxCompValue = nodesData[0].comp_value;
		var maxIndex = 0;
		var maxCompIndex = 0;
		for (var i = 0; i < nodesData.length; i++) {
			nodesData[i].color = 'lightblue';
			if (nodesData[i].value > maxValue) {
				maxValue = nodesData[i].value;
				maxIndex = i;
			}
			if (nodesData[i].comp_value > maxCompValue) { maxCompValue = nodesData[i].comp_value; maxCompIndex = i; }
		}
		// console.log(maxCompIndex)
		nodesData[maxIndex].color = 'coral';
		// console.log(nodesData[maxIndex]);
		if (is_sim == false) {
			nodesData[maxIndex].time += feedback;
			feedback_comp = feedback;
			nodesData[maxCompIndex].comp_time += feedback_comp;
		}
		else {
			var temp_len = reviewData[maxIndex]['review'].length;
			var temp_len_comp = reviewData[maxCompIndex]['review'].length;
			feedback = reviewData[maxIndex]['review'][total_round.value % temp_len]
			nodesData[maxIndex].time += feedback;
			feedback_comp = reviewData[maxCompIndex]['review'][total_round.value % temp_len_comp]
			nodesData[maxCompIndex].comp_time+= feedback_comp;
			// console.log(feedback,feedback_comp)
			// console.log(reviewData[maxIndex]['review'][total_round.value % temp_len])
		}

		total_round.value += 1;

		for (var i = 0; i < nodesData.length; i++) {
			var temp = 0;
			var temp_comp = 0;
			if (algo == 'UCB') { temp = Math.floor((nodesData[i].time / total_round.value + k_UCB * Math.sqrt(2.0 * Math.log(total_round.value) / (nodesData[i].time + 1))) * 100) / 100; }
			if (algo == 'Random') { temp = Math.floor(Math.random() * 100) / 100 }
			if (algo == 'ETC') {
				if (total_round.value < n_node * m_ETC) { temp = Math.floor(Math.random() * 100) / 100 }
				else { temp = Math.floor((nodesData[i].time / total_round.value) * 100) / 100 }
			}
			if (algo_comp == 'UCB') { temp_comp = Math.floor((nodesData[i].comp_time / total_round.value + k_UCB2 * Math.sqrt(2.0 * Math.log(total_round.value) / (nodesData[i].comp_time + 1))) * 100) / 100; }
			if (algo_comp == 'Random') { temp_comp = Math.floor(Math.random() * 100) / 100; }
			if (algo_comp == 'ETC') {
				if (total_round.value < n_node * m_ETC2) { temp_comp = Math.floor(Math.random() * 100) / 100 }
				else { temp_comp = Math.floor((nodesData[i].comp_time / total_round.value) * 100) / 100 }
			}
			// console.log();
			nodesData[i].value = temp;
			nodesData[i].comp_value = temp_comp;
		}
		// console.log(feedback);
		total_regret.value += feedback;
		comp_total_regret.value += feedback_comp;
		regret_history.push({ "round": total_time.value, "value": total_regret.value / total_time.value })
		comp_regret_history.push({ "round": total_time.value, "value": comp_total_regret.value / total_time.value })
		// console.log(feedback,feedback_comp)
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

const algoSelect = document.getElementById("algoSelect");
const compSelect = document.getElementById("compSelect");
const ETC1 = document.getElementById("m_ETC");
const ETC2 = document.getElementById("m_ETC2");
const UCB1 = document.getElementById("k_UCB");
const UCB2 = document.getElementById("k_UCB2");
var algo = algoSelect.value;
var comp_algo = compSelect.value;
var m_ETC = ETC1.value;
var m_ETC2 = ETC2.value;
var k_UCB = UCB1.value;
var k_UCB2 = UCB2.value;
algoSelect.addEventListener("change", function () { algo = algoSelect.value; });
compSelect.addEventListener("change", function () { comp_algo = compSelect.value; });
ETC1.addEventListener("change", function () { m_ETC = ETC1.value; });
ETC2.addEventListener("change", function () { m_ETC2 = ETC2.value; });
UCB1.addEventListener("change", function () { k_UCB = UCB1.value; });
UCB2.addEventListener("change", function () { k_UCB2 = UCB2.value; });
document.getElementById('likeButton').addEventListener('mousedown', function () { updateNodes(total_time, algo, comp_algo, true, false) });
document.getElementById('dislikeButton').addEventListener('mousedown', function () { updateNodes(total_time, algo, comp_algo, false, false) });
document.getElementById('simButton').addEventListener('mousedown', function () { updateNodes(total_time, algo, comp_algo, true, true) });

const sr = ScrollReveal({
	distance: '65px',
	duration: 2600,
	delay: 450,
	reset: true
});


sr.reveal('#d3-container', { delay: 10, origin: 'top' });
sr.reveal('.button1', { delay: 10, origin: 'top' });