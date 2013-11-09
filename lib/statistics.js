// Initialize! -------------- This section has to begin loading when the whole website loads to precatch all the info.
var places = [];
var datums = [];
var deaths = [];

var paises = {};
var fechas = [];
var muerte = {};


function init() {
    $.ajax({
        url:'http://safetrails.herokuapp.com/index.php/cases/distinct?fields[]=country',
        dataType:'json',
        xhrFields: {
                withCredentials: false
        },
        type:'GET',
        success:function(data) {
                // Extract info
                places = normalizer(data.country.values);
        }
    });
    $.ajax({
        url:'http://safetrails.herokuapp.com/index.php/cases/distinct?fields[]=report_date',
        dataType:'json',
        xhrFields: {
                withCredentials: false
        },
        type:'GET',
        success:function(data) {
                // Extract info
                datums = itsaDate(data.report_date.values);
        }
    });
    $.ajax({
        url:'http://safetrails.herokuapp.com/index.php/cases/distinct?fields[]=cod',
        dataType:'json',
        xhrFields: {
                withCredentials: false
        },
        type:'GET',
        success:function(data) {
                // Extract info
                deaths = normalizer(data.cod.values);
        }
    });
}

function normalizer (array) {
    var new_array = [];
    for (var item in array) {
        temp = item.toLowerCase();
        if (new_array.indexOf(temp) == -1) {
            new_array.push(temp);
        }
    }
    return new_array;
}

function itsaDate (array) {
    var new_array = [];
    for (var item in array) {
        tmp = new Date(item);
        if (tmp != 'Invalid Date') {
            new_array.push(tmp);
        }
    }
    return new_array;
}

function globalFetcher () {
    for (var eins = 0; eins < places.length; eins++) {
        tmpM = fetchTotals([['gender','male'],['country',places[eins]]]);
        tmpF = fetchTotals([['gender','female'],['country',places[eins]]]);
        paises[eins] = {'nombre': places[eins], 'genero': {[{'name': 'male', 'value': tmpM}, {'name': 'female', 'value': tmpF}]} };
    }
    for (var zwei = 0; zwei < deaths.length; zwei++) {
        chrM = fetchTotals([['gender','male'],['country',deaths[zwei]]]);
        chrF = fetchTotals([['gender','female'],['country',deaths[zwei]]]);
        muerte[zwei] = {'nombre': deaths[zwei], 'genero': {[{'name': 'male', 'value': tmpM}, {'name': 'female', 'value': tmpF}]} };
    }
    var hoy = new Date();
    for (var drei = datums[0].getFullYear(); drei < (hoy.getFullYear() + 1); drei++) {
        for (var vier = 0; vier < 12; vier++) {
            fechas.push([new Date(drei, vier),0]);
        }
    }
}

function fetchTotals(fields) {
        var tots = 0;
        var commands = "";
        for (var c in fields) {
                commands = commands + '&' + c[0] + '=' + c[1];
        }
        $.ajax({
                url:'http://safetrails.herokuapp.com/index.php/cases?count=true&' + commands,
                dataType:'string',
                xhrFields: {
                        withCredentials: false
                },
                async: false,
                type:'GET',
                success:function(data) {
                        // Extract info
                        tots = data;
                }
        });
        return tots;
}

init();
globalFetcher();

// Graphics methods ----------- This section has methods which will be loaded on demand (when a button is clicked) *Change method to get data. There shouldn't be a REST request in these methods.

function cleaner() {
        svg.selectAll("path").data([]).exit().remove();
        svg.selectAll("g").data([]).exit().remove();
        document.getElementById('controls').innerHTML = '';
        document.getElementById('stats').innerHTML = '';
}

// Double bar graphic function
function doubleBarGraph(datos, title) {

        var margin = {top: 10, right: 10, bottom: 25, left: 30},
        width = 600 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

        var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

        var x1 = d3.scale.ordinal();

        var y = d3.scale.linear()
        .range([height, 0]);

        var color = d3.scale.ordinal()
        .range(["#55aa55", "#99ff99"]);

        var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

        var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

        document.getElementById(place).innerHTML = "<p style='font: 20 px; font-family: sans-serif'><br>" + title + "</p>";

        var svg = d3.select("div#stats").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var generos = ['male','female'];

        x0.domain(datos.map(function(d) { return d.nombre; }));
        x1.domain(generos).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(datos, function(d) { return d3.max(d.genero, function(d) { return d.value; }); })]);

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Individuals");

        var state = svg.selectAll(".state")
        .data(datos)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x0(d.nombre) + ",0)"; });

        state.selectAll("rect")
        .data(function(d) { return d.genero; })
        .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return color(d.name); });

        var legend = svg.selectAll(".legend")
        .data(generos.slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

        legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
}

// MultiLine tendencies graphics function
function multiTrendsGraph(datos, title, place) {
    var margin = {top: 10, right: 60, bottom: 25, left: 30},
        width = 600 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y%m%d").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category20c();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.immigrants); });

    var svg = d3.select("div#stats").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Fix this to work well. It should receive a JSON object, so ... it's time to change the initializer. ####################################

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

    var values = color.domain().map(function(name) {
        return {
                name: name,
                values: data.map(function(d) {
                          return {date: d.date, temperature: +d[name]};
                })
        };
    });

    x.domain(d3.extent(data, function(d) { return d[0]; }));

    y.domain([
    d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
    d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
    ]);

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Temperature (ºF)");

    var city = svg.selectAll(".city")
    .data(cities)
    .enter().append("g")
    .attr("class", "city");

    city.append("path")
    .attr("class", "line")
    .attr("d", function(d) { return line(d.values); })
    .style("stroke", function(d) { return color(d.name); });

    city.append("text")
    .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
    .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
    .attr("x", 3)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });
}

// TODO: functions to load data for the tendencies (use local db for speed)

// TODO: function to load controls (dropdowns + Update button) ##############################################################################################################################
// Activates general graphics
function generals() {
        doubleBarGraph('tablita.csv', 'Deaths in various corridors across the border.');
}        

// Activates special graphics
function specials() {
        document.getElementById('stats').innerHTML = "<p style='font: 20 px; font-family: sans-serif'><br>Under construction ...</p>";
}