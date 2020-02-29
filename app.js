//Create chart space
var svgWidth = 750;
var svgHeight = 600;

var margin = {
    top: 30,
    right: 20,
    bottom: 70,
    left: 70
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create SVG wrapper
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width",svgWidth)
    .attr("height",svgHeight);

//Append SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Import Data
d3.csv("census.csv").then(function(census) {
    
    //Cast data as numbers
    census.forEach(function(data) {
        data.obesity = +data.obesity;
        data.income = +data.income;
    });

    //Scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(census, d => d.obesity)-1,d3.max(census, d => d.obesity)+1])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(census, d => d.income)-1000, d3.max(census, d => d.income)])
        .range([height, 0]);

    //Axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append axes to chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    //Create bubbles for chart
    circleGroup = chartGroup.selectAll("circle")
        .data(census).enter()
    //Append circles
    circleGroup
        .append("circle")
        .attr("cx", d => xLinearScale(d.obesity))
        .attr("cy", d => yLinearScale(d.income))
        .attr("r", "10")
        .attr("fill", "blue")
        .attr("opacity", "0.7")
        .attr("state", d => d.abbr);

    //Add State text to circles
    circleGroup
        .append("text")
        .attr("fill","white")
        .attr("font-size","10")
        .attr("text-anchor","middle")
        .attr("x", d => xLinearScale(d.obesity))
        .attr("y", d => yLinearScale(d.income)+5)
        .text(d => d.abbr);

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Income");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Obesity %");
});

