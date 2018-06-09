// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 50,
  right: 40,
  bottom: 90,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth)

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from Top 12 countries csv
d3.json("Top12varieties.json", function (error, byVariety) {
  if (error) throw error;
  //console.log(byVariety);

  // Cast the review count value to a number for each piece of byVariety data
  byVariety.forEach(function (d) {
    d.varietyCnt = +d.varietyCnt;
    //console.log(d.varietyCnt);
  });


  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
  var xBandScale = d3.scaleBand()
    .domain(byVariety.map(d => d.variety))
    .range([0, chartWidth])
    .padding(0.1);

  // Create a linear scale for the vertical axis.
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(byVariety, d => d.varietyCnt)])
    .range([chartHeight, 0])

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xBandScale);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

  // Create group for x-axis label
  var labelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${chartWidth/2}, ${chartHeight + 20})`)

  var varietyLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 65)
  .classed("active", true)
  .text("Variety");

  // append y axis
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 20 - chartMargin.left)
  .attr("x", 0 - (chartHeight / 2))
  .attr("dy", "1em")
  .classed("axis-text", true)
  .text("Number of Reviews");
  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis)
      .selectAll("text")  
      .style("text-anchor", "start")
      .attr("dx", ".35em")
      .attr("dy", ".25em")
      .attr("transform", "rotate(25)");

  // Title
  chartGroup.append("text")
        .attr("x", (chartWidth / 2))             
        .attr("y", 0 - (chartMargin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "24px") 
        .style("text-decoration", "underline")  
        .text("Top 12 Varieties by Review Count");

  // Tool tips: Append a div to the body to create tooltips, assign it a class
  var toolTip = d3.select("body").append("div")
    .attr("class", "tooltip");
  
  // Use the linear and band scales to position each rectangle within the chart
  chartGroup.selectAll(".bar")
    .data(byVariety)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xBandScale(d.variety))
    .attr("y", d => yLinearScale(d.varietyCnt))
    .attr("width", xBandScale.bandwidth())
    .attr("height", d => chartHeight - yLinearScale(d.varietyCnt))
    .on('mouseover', function (d, i) {
      toolTip.style("display", "block")
      toolTip.html(`Variety: ${d.variety}</br> Review Count: ${d.varietyCnt}`)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px")
      })
    .on("mouseout", function (){
          toolTip.style("display", "none")    
      }); 

});
