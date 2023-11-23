const n_node = 5;
		// Dimensions for the SVG container
		const width = 750, height = 500;
		const total_time = { value: 0.0 };
		const nodesData = Array.from({ length: n_node }, (_, i) => ({ id: i, value: 0.0, time: 0.0, text: 'text' }));
		// Create SVG container
		const svg = d3.select("#d3-container").append("svg")
			.attr("width", width)
			.attr("height", height);
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

			// Draw circles for each node
			node.append("circle")
				.attr("r", 20)
				.attr("fill", "lightblue");

			// Add labels to nodes
			node.append("text")
				.attr("class", "label")
				.attr("y", 5)
				.attr("text-anchor", "middle")
				.text(d => d.value);
			return node
		}



		// Function to update node values
		async function updateNodes(total_round, feedback = true, is_sim = false) {
			// Select a random node and increment its value
			// const randomIndex = Math.floor(Math.random() * nodesData.length);
			// index should be the node with highest UCB (three algorithms)
			//TODO choose index of max

			reviewData = await get_review();
			const repeat = document.getElementById("simSelect").value;
			console.log(repeat)
			for (var j = 0; j < repeat; j++) {
				var maxValue = nodesData[0].value;
				var maxIndex = 0;
				for (var i = 0; i < nodesData.length; i++) {
					if (nodesData[i].value > maxValue) {
						maxValue = nodesData[i].value;
						maxIndex = i;
					}
				}
				console.log(maxIndex);
				if (is_sim == false) {
					nodesData[maxIndex].time += feedback;
				}
				else {
					var temp_len = reviewData[maxIndex]['review'].length;
					nodesData[maxIndex].time += reviewData[maxIndex]['review'][total_round.value % temp_len];
					// console.log(reviewData[maxIndex]['review'][total_round.value % temp_len])
					//TODO add total round to this
				}
				total_round.value += 1;
				for (var i = 0; i < nodesData.length; i++) {
					var temp = Math.floor((nodesData[i].time / total_round.value + 0.5 * Math.sqrt(2.0 * Math.log(total_round.value) / (nodesData[i].time + 1))) * 100) / 100;
					// console.log(nodesData[i].time / total_round.value);
					nodesData[i].value = temp;
				}
				// Update labels
				updateLabels();
				if (is_sim == false) { break; }
			}
		}

		// Function to update labels
		async function updateLabels() {
			svg.selectAll(".label")
				.data(nodesData)
				.text(d => d.value);
			d3_plot();
		}

		// Event listener for the button
		//TODO should be simulating user feedback
		document.getElementById('likeButton').addEventListener('click', function () { updateNodes(total_time, feedback = true) });
		document.getElementById('dislikeButton').addEventListener('click', function () { updateNodes(total_time, feedback = false) });
		document.getElementById('simButton').addEventListener('click', function () { updateNodes(total_time, feedback = true, is_sim = true) });