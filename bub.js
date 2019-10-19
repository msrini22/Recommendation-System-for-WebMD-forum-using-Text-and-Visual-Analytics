(function(){
    var width =1500;
	height = 700;
    aux = "#F08080";
    box = "#008080";

	var svg = d3v4.select("#chart")
		.append("svg")
		.attr("height",height)
		.attr("width",width)
		.append("g")
		.attr("transform","translate(0," + height / 2 +")")

		//give [min.max] of data and for size of circles
	var radiusScale = d3v4.scaleSqrt().domain([14,4398]).range([20,90])

	var forceX = d3v4.forceX(function(d){
		if(d.decade === 'Contributor'){
			return 250
		} else{
			return 700
		}
	}).strength(0.1)
		
	var forceCollide = d3v4.forceCollide(function(d) {
			return radiusScale(d.sales)+2;
		})

	var simulation = d3v4.forceSimulation()
		.force("x", d3v4.forceX(width/2).strength(0.05))
		.force("y", d3v4.forceY().strength(0.05))
		.force("collide", forceCollide)

	d3v4.queue()
		.defer(d3v4.csv, "members.csv")
		.await(ready)

	function ready (error, datapoints) {

		var circles = svg.selectAll(".artist")
		.data(datapoints)
		.enter().append("circle")
		.attr("class","artist")
		.attr("r", function(d) {
			return radiusScale(d.sales);
		})
		.attr("fill",function(d){
			if (d.decade === 'Contributor'){
			return aux;
		} else{
			return box;
		}
		})
		.on('hover', function(d){
			console.log(d)
		})
		// .attr("cx", 100)
		// .attr("cy", 300)
		
		d3v4.select("#decade").on('click', function(){
			simulation
				.force("x",forceX)
				.alphaTarget(0.25)
				.restart()
		})
		d3v4.select('#combine').on('click', function(){
			simulation
				.force("x",d3v4.forceX(width/2).strength(0.05))
				.alphaTarget(0.25)
				.restart()
		})

		// var svvv = d3v4.select("#chart")
		// .append("svg")
		// .attr("height",height)
		// .attr("width",width)
		// .append("g")
		var labels = svg.selectAll(".artist-label")
		  .data(datapoints)
		  .enter().append("text")
		  .attr("class", "artist-label")
		  .attr("text-anchor", "middle")
		  .attr("fill", "black")
		  // .attr("font-size", "12px")
		  .style("font-size", "9px")
		  .text(function(d) {
		    return [d.name];
		  })

		simulation.nodes(datapoints)
		 .on('tick', ticked)

		 function ticked(){
			circles
				.attr("cx", function(d){
					return d.x
				})
				.attr("cy", function(d){
					return d.y
				})	
			labels
				  .attr("x", function(d) {
				    return d.x;
				  })
				  .attr("y", function(d) {
				    return d.y;
				  })
		}
	}
})();

