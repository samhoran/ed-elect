// Because I'm running two very similar scripts on this page, at Ori's suggestion I'm wrapping them both
// in functions so that they don't mess with one another, then immediately calling those functions.

(function() {
  var margin = {top: 60, right: 20, bottom: 160, left: 70},
    width = 700 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Exact Proportion:</strong> <span style='color:black'>" + d.ed_perc + "</span>";
  })

var svg = d3.select("div#chart_unsorted").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "cand_2020")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.tsv("data/cand_2020.tsv", type, function(error, data) {
  x.domain(data.map(function(d) { return d.candidate; }));
  y.domain([0, d3.max(data, function(d) { return d.ed_perc; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)" );

  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width/2)
    .attr("y", height+150)
    .text("Candidate Name");

  svg.append("text")
    .attr("class", "plot title")
    .attr("x",width/2)
    .attr("y",0-(margin.top/2))
    .attr("text-anchor", "middle")
    .text("Percentage of Tweets Including Education-Related Terms by Candidate")


  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
     .text("Percentage");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.candidate); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.ed_perc); })
      .attr("height", function(d) { return height - y(d.ed_perc); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

});

function type(d) {
  d.frequency = +d.frequency;
  return d;
}
})();
