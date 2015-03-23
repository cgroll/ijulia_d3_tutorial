function lineChart() {
    
    // define margins
    var margin = {top: 20, right: 80, bottom: 30, left: 150};
    var outerWidth = 960;
    var outerHeight = 500;
    
    function chart(selection) {
        
        // for each element in the current selection:
        // each element has its own data
        // note: gets called with single selected element
        selection.each(function(data) {
            
            // graphics size without axis
            var width = outerWidth - margin.left - margin.right;
            var height = outerHeight - margin.top - margin.bottom;

            // append svg to current selection, given by "this"
            var svg = d3.select(this).append("svg")
                .attr("width", outerWidth)
                .attr("height", outerHeight)
                .append("g")
                .attr("transform",
                      "translate(" + margin.left
                      + "," + margin.top + ")");

            // define axes
            var x = d3.time.scale()
                .range([0, width]);
            
            var y = d3.scale.linear()
                .range([height, 0]);
            
            var color = d3.scale.category10();
            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");
            
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(5);
            
            var parseDate = d3.time.format("%Y-%m-%d").parse;
            
            var line = d3.svg.line()
                .interpolate("basis")
                .x(function(d) { return x(d.idx); })
                .y(function(d) { return y(d.gdp); });
            
            // refine data
            color.domain(d3.keys(data[0])
                         .filter(function(key) { return key !== "idx"; }));

            // process dates
            data.forEach(function(d) {
                d.idx = parseDate(d.idx);
            });
            
            var tseries = color.domain().map(function(name) {
                
                dataWithNaN = data.map(function(d) {
                    return {idx: d.idx, gdp: +d[name]};
                });
                
                var fltData = dataWithNaN.filter(
                    function(d) { return !isNaN(d.gdp)});
                
                return {
                    name: name,
                    values: fltData
                };
            });
            
            x.domain(d3.extent(data, function(d) { return d.idx; }));
            
            y.domain([
                d3.min(tseries,
                       function(c) {
                           return d3.min(c.values,
                                         function(v) { return v.gdp; }); }),
                d3.max(tseries,
                       function(c) {
                           return d3.max(c.values,
                                         function(v) { return v.gdp; }); })
            ]);
            
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);
            
            svg.append("g")
                .attr("class", "axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("GDP in bn $");
            
            var gdp = svg.selectAll(".gdp")
                .data(tseries)
                .enter().append("g")
                .attr("class", "gdp");
            
            gdp.append("path")
                .attr("class", "line")
                .attr("d", function(d) { return line(d.values); })
                .style("stroke", function(d) { return color(d.name); });
            
        });
    };
    
    chart.width = function(_) {
        if (!arguments.length) return outerWidth;
        outerWidth = _;
        return chart;
    };
    
    chart.height = function(_) {
        if (!arguments.length) return outerHeight;
        outerHeight = _;
        return chart;
    };
    
    return chart;
}
