var places = [];
var corrid = [];
var datums = [];
var deaths = [];


function fetchTotals(fields) {
	var tots = 0;
	var commands = "";
	for (var c in fields) {
		commands = commands + '&' + c[0] + '=' + c[1];
	}
	$.ajax({
		url:'http://safetrails.herokuapp.com/cases/index.php?count=true&' + commands,
		dataType:'string',
		xhrFields: {
			withCredentials: false
		},
		type:'GET',
		success:function(data) {
			// Extract info
			tots = data;
		}
	});
	return tots;
}

function getKeyes(catergory, value) {
	var lugares = null;
	$.ajax({
		url:'http://safetrails.herokuapp.com/cases/index.php?' + category + '=' + value,
		dataType:'json',
		xhrFields: {
			withCredentials: false
		},
		type:'GET',
		success:function(data) {
			// Extract info
			database = data;
		}
	});
	return lugares;
}

// Checks if an element is in an array of arrays
function checkArray(array, value) {
	ctrl = 0;
	for (var i = 0; i < arra.length; i++) {
		if (arra[i][0] == dato) {
			ctrl++;
		}
	}
	if (ctrl > 0) {
		return true;
	} else {
		return false;
	}
}

// JSON builder for the double bar graphic functions
function toJSON(ref0, ref1, ref2) {
	var jason = {};
	for (var i = 0; i < ref0.length; i++) {
		if (checkArray(ref0[i][0], ref1) || checkArray(ref0[i][0], ref2)) {
			var mf = [0,0];
			for (var j = 0; j < ref1.length; j++) {
				if (ref0[i][0] == ref1[j][0]) {
					mf[0] = ref1[j][1];
				}
			}
			for (var k = 0; k < ref2.length; k++) {
				if (ref0[i][0] == ref2[k][0]) {
					mf[1] = ref2[k][1];
				}
			}
			jason[i] = {'nombre': ref0[i], 'genero': {[{'name': 'male', 'value': mf[0]}, {'name': 'female', 'value': mf[1]}]} };
		}
	}
	return jason;
}

function cleaner() {
	svg.selectAll("path").data([]).exit().remove();
	svg.selectAll("g").data([]).exit().remove();
	document.getElementById('controls').innerHTML = '';
	document.getElementById('stats').innerHTML = '';
}

// Double bar graphic function
function doubleBarGraph(datos, title, place) {

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

	d3.json(datos, function(error, data) {
		var generos = ['male','female'];

		x0.domain(data.map(function(d) { return d.nombre; }));
		x1.domain(generos).rangeRoundBands([0, x0.rangeBand()]);
		y.domain([0, d3.max(data, function(d) { return d3.max(d.genero, function(d) { return d.value; }); })]);

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
		.data(data)
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

	});
}

// TODO: second graphics function - multiple line plot to show tendencies (ckeck MSC) ###############################################################################################
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

	var svg = d3.select("stats").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.tsv(datos, function(error, data) {

		color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

		data.forEach(function(d) {
	    	d.date = parseDate(d.date);
		});

		var cities = color.domain().map(function(name) {
	    	return {
	    		name: name,
	    		values: data.map(function(d) {
	      			return {date: d.date, temperature: +d[name]};
	    		})
	    	};
		});

	  x.domain(d3.extent(data, function(d) { return d.date; }));

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
	});
}

// TODO: function to load controls (dropdowns + Update button)
// Activates general graphics
function generals() {
	doubleBarGraph('tablita.csv', 'Deaths in various corridors across the border.', 'stats');
}	

// Activates special graphics
function specials() {
	document.getElementById('stats').innerHTML = "<p style='font: 20 px; font-family: sans-serif'><br>Under construction ...</p>";
}