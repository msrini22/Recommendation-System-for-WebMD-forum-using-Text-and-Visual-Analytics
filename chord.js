var w = 1280,
    h = 800,
    r1 = (h-200) / 2,
    r0 = r1 - 80;

var fill = d3.scale.category20c();

var chord = d3.layout.chord()
    .padding(.04)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending);

var arc = d3.svg.arc()
    .innerRadius(r0)
    .outerRadius(r0 + 10);

var svg = d3.select("#chord").append("svg:svg")
    .attr("width", w)
    .attr("height", h)
  .append("svg:g")
    .attr("transform", "translate(" + (w) / 2 + "," + (h) / 2 + ")");

var indexByName = {"Period": 0,"Pregnancy": 1,"Pain": 2,"Drug": 3,"Sexual Intercourse": 4,"Skin": 5,"Baby": 6,"Drinking": 7},
    nameByIndex = {0: "Period",1: "Pregnancy",2: "Pain",3: "Drug",4: "Sexual Intercourse",5: "Skin",6: "Baby",7: "Drinking"},
    n = 0;

var matrix = [
  [1465,621,113,7,215,7,41,15], /*Period*/
  [621,1551,57,18,256,9,138,34], /*Pregnancy*/
  [113,57,1992,24,39,39,20,42], /*Pain*/
  [7,18,24,386,4,5,7,18], /*Drug*/
  [215,256,39,4,747,12,14,11], /*Sexual Intercourse*/
  [7,9,39,5,12,639,8,5], /*Skin*/
  [41,138,20,7,14,8,411,9], /*Baby*/
  [15,34,42,18,11,5,9,512] /*Drinking*/
];

  chord.matrix(matrix);

  var g = svg.selectAll("g.group")
      .data(chord.groups)
    .enter().append("svg:g")
      .attr("class", "group")
      .on("mouseover", fade(.02))
      .on("mouseout", fade(.80));

  g.append("svg:path")
      .style("stroke", function(d) { return fill(d.index); })
      .style("fill", function(d) { return fill(d.index); })
      .attr("d", arc);

  g.append("svg:text")
      .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
      .attr("transform", function(d) {
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
            + "translate(" + (r0 + 26) + ")"
            + (d.angle > Math.PI ? "rotate(180)" : "");
      })
      .text(function(d) { return nameByIndex[d.index]; });

  svg.selectAll("path.chord")
      .data(chord.chords)
    .enter().append("svg:path")
      .attr("class", "chord")
      .style("stroke", function(d) { return d3.rgb(fill(d.source.index)).darker(); })
      .style("fill", function(d) { return fill(d.source.index); })
      .attr("d", d3.svg.chord().radius(r0));

// Returns an event handler for fading a given chord group.
function fade(opacity) {
  return function(d, i) {
    svg.selectAll("path.chord")
        .filter(function(d) { return d.source.index != i && d.target.index != i; })
      .transition()
        .style("stroke-opacity", opacity)
        .style("fill-opacity", opacity);
  };
}