document.addEventListener('DOMContentLoaded', function () {
	const submitButton = document.getElementById('submitButton');
	const resultTextbox = document.getElementById('resultTextbox');

	submitButton.addEventListener('click', function () {
		// const return_value
		fetch('http://127.0.0.1:5001/run', {
			method: 'GET',
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json(); // Parse the response as JSON
			})
			.then(data => {
				// Handle the JSON data
				// console.log(data);
				// resultTextbox.value=data.result;
				var svg = d3.select("svg");
				for(idx of JSON.parse(data.result)){
					console.log(idx);
					// svg.selectAll("text")
					// .data(treeData.descendants())
					// .enter()
					// .append("text")
					// .text(function (d) { return d.data.value; })
					// .attr("x", function (d) { return d.x + 10; })
					// .attr("y", function (d) { return d.y + 20; });
				};
			})
			.catch(error => {
				console.error('There was a problem with the fetch operation:', error);
			});

	});
});
