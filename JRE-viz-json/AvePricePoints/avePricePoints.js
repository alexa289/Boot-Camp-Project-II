// Chart Params
var svgWidth = 960;
var svgHeight = 660;

var margin = { 
  top: 50, 
  right: 40,
  bottom: 100, 
  left: 100
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from an external CSV file
d3.json("countryAve.json", function(error, aveCountryData) {
  if (error) throw error;

  console.log(aveCountryData);
  //console.log([aveCountryData]);

  

  // Format the data (cast the ave price and ave points)
  aveCountryData.forEach(function(data) {
    aveCountryData.avePrice = +aveCountryData.avePrice;
    aveCountryData.avePoints = +aveCountryData.avePoints;
  });
    console.log(aveCountryData);
    //console.log([aveCountryData]);
  // Create scaling functions
  var xCountryScale = d3.scaleBand()
    .domain(aveCountryData.map(d => d.country))
    .range([0, width])
    .padding(0.1);

  var yLinearScale1 = d3.scaleLinear()
    .domain([0, d3.max(aveCountryData, d => d.avePrice)])
    .range([height, 0]);

  var yLinearScale2 = d3.scaleLinear()
    .domain([0, d3.max(aveCountryData, d => d.avePoints)])
    .range([height, 0]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xCountryScale)
  var leftAxis = d3.axisLeft(yLinearScale1);
  var rightAxis = d3.axisRight(yLinearScale2);

  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis)
      .selectAll("text")  
      .style("text-anchor", "start")
      .attr("dx", ".35em")
      .attr("dy", ".25em")
      .attr("transform", "rotate(35)");

  // Add y1-axis to the left side of the display
  chartGroup.append("g")
    // Define the color of the axis text
    .classed("green", true)
    .call(leftAxis);

  // Add y2-axis to the right side of the display
  chartGroup.append("g")
    // Define the color of the axis text
    .classed("blue", true)
    .attr("transform", `translate(${width}, 0)`)
    .call(rightAxis);

  // Create Circles 1
  //var circlesGroup1 = chartGroup.selectAll("circle")
  //.data(aveCountryData)
  //.enter()
  //.append("circle")
  //.attr("cx", d => xCountryScale(d.country))
  //.attr("cy", d => yLinearScale1(d.avePrice))
  //.attr("r", "5")
  //.attr("fill", "green")
  //.attr("opacity", ".9")  

  // Create Circles 2
  // var circlesGroup2 = chartGroup.selectAll("circle")
  // .data(aveCountryData)
  // .enter()
  // .append("circle")
  // .attr("cx", d => xCountryScale(d.country))
  // .attr("cy", d => yLinearScale2(d.avePoints))
  // .attr("r", "5")
  // .attr("fill", "blue")
  // .attr("opacity", ".9")  

  // Line generators for each line
  var line1 = d3.line()
    .x(d => xCountryScale(d.country))
    .y(d => yLinearScale1(d.avePrice));

  var line2 = d3.line()
    .x(d => xCountryScale(d.country))
    .y(d => yLinearScale2(d.avePoints));

  // Append a path for line1
  chartGroup.append("path")
    .data([aveCountryData])
    .attr("d", line1)
    .classed("line green", true);

  // Append a path for line2
  chartGroup.append("path")
    .data([aveCountryData])
    .attr("d", line2)
    .classed("line blue", true);

  // Append axes titles
  chartGroup.append("text")
  .attr("transform",`translate(${width / 2}, ${height + margin.top + 20})`)
    .classed("price-text", true)
    .text("Average Price");

  chartGroup.append("text")
  .attr("transform",`translate(${width / 2}, ${height + margin.top + 37})`)
    .classed("points-text", true)
    .text("Average Points");
  
  // Title
  chartGroup.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "24px") 
        .style("text-decoration", "underline")  
        .text("Average Price & Points by Country");  
  
});
