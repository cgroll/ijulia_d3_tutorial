function lineChart(tm::Timematr, canvasName::String)

    ## missing: warning that data is written to local file
    
    ## - save data to disk
    tmpFileName1 = tempname()
    tmpFileName = string(".", tmpFileName1)
    writeTimedata(tmpFileName, tm)

    ## - load JavaScript library
    loadJSCode = """
<script src="lineChart.js"></script>
"""

    ## - customize chart    
    customizeChart = """
<script>
var customizedChart = lineChart()
.width(800)
.height(400)
</script>
"""

    ## - load data, select canvas, bind data, call chart
    callChart = """
<script>
d3.csv("$tmpFileName", function(data) {
d3.select(".$canvasName")
.datum(data)
.call(customizedChart)
})
</script>
"""
    
    jsCode = string(loadJSCode, "\n",
                    customizeChart, "\n",
                    callChart)

    ## TODO: load CSS
    return Raw_html(jsCode)
end
