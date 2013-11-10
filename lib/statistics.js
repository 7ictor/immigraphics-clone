// Initialize variables
var database = null;
var total = 0;
var males = 0;
var females = 0;
var datest = [];
var datesm = [];
var datesf = [];
var placest = [];
var placestC = [];
var placesm = [];
var placesmC = [];
var placesf = [];
var placesfC = [];
var tipot = [];
var tipotC = [];
var tipom = [];
var tipomC = [];
var tipof = [];
var tipofC = [];

// Restructuring model
var all = null;

// Create a tree
function datesGenerator() {
	all = {"males":[], "female":[], "totals":[]}
	datum = (new Date()).getFullYear() + 1;
	for (var i = 2000; i < datum; i++) {
		for (var j = 0; j < 12; j++) {
			all['males'].push( [i + (j * 0.01), [0, 0]] );
			all['female'].push( [i + (j * 0.01), [0, 0]] );
			all['totals'].push( [i + (j * 0.01), [0, 0]] );
		}
	}
}

// Need to have dictionaries
function arrayToDict(arra) {
	dict = {};
	for (var k = 0; k < arra.length; k++) {
		dict[arra[k]] = 0;
	}
	return dict;
}

function JSONtoArray(json, prop) {
	var llaves = Object.keys(json);
	var new_array = new Array(llaves.length);
	for (var i = 0; i < llaves.length; i++) {
		new_array[i] = json[llaves[i]][prop];
	}
	return new_array;
}

// Making tree have branches
function treeSeed() {
	for (var i = 0; i < all['males'].length; i++) {
		all['males'][i][1][0] = arrayToDict(tipom);
		all['males'][i][1][1] = arrayToDict(placesm);

		all['female'][i][1][0] = arrayToDict(tipof);
		all['female'][i][1][1] = arrayToDict(placesf);
		
		all['totals'][i][1][0] = arrayToDict(tipot);
		all['totals'][i][1][1] = arrayToDict(placest);
	}
}

// Making tree have leaves
function dataRestructure(item, gender) {
	datum = new Date(item['report_date']);
	fecha = datum.getFullYear() + (datum.getMonth() * 0.01);
	for (var i = 0; i < all[gender].length; i++) {
		tot = item.cod;
		lan = item.country;
		if ( (fecha == all[gender][i][0]) && (tot != undefined) ) {
			all[gender][i][1][0][tot.toLowerCase()] += 1;
		}
		if ( (fecha == all[gender][i][0]) && (lan != undefined) ) {
			all[gender][i][1][1][lan.toLowerCase()] += 1;
		}
	}
}

// Everything blooms now
function waterTheTree(db) {
	var llaves = Object.keys(db);
	for (var i = 0; i < llaves.length; i++) {
		if (db[llaves[i]].gender == "male") {
			dataRestructure(db[llaves[i]], 'males');
		}
		if (db[llaves[i]].gender == "female") {
			dataRestructure(db[llaves[i]], 'female');
		}
		dataRestructure(db[llaves[i]], 'totals');
	}
}

// Checks if an item is in a given array
function checkArray(dato, arra) {
	ctrl = 0;
	for (var i = 0; i < arra.length; i++) {
		if (arra[i] == dato) {
			ctrl++;
		}
	}
	if (ctrl > 0) {
		return true;
	} else {
		return false;
	}
}

// Fills the arrays with data
function filler(dato, count, arra) {
	var b = checkArray(dato, arra);
	if (!b) {
		arra.push(dato);
		count.push(0);
	}
	for (var i = 0; i < arra.length; i++) {
		if (arra[i] == dato) {
			count[i] += 1;
		}
	}
}

// Initialize the dates arrays
function datesInitializer() {
	datum = (new Date()).getFullYear() + 1;
	for (var i = 2000; i < datum; i++) {
		for (var j = 0; j < 12; j++) {
			datest.push([i + (j/100),0]);
			datesm.push([i + (j/100),0]);
			datesf.push([i + (j/100),0]);
		}
	}
}

// Fills the date data by month
function datador(dato, arra) {
	for (var i = 0; i < arra.length; i++) {
		if (arra[i][0] == dato) {
			arra[i][1] = arra[i][1] + 1;
		}
	}
}

// Extracts basic info from the database
function extractor(db) {
	llaves = Object.keys(db)
	for (var i = 0; i < llaves.length; i++ ) {
		if ((db[llaves[i]].country != undefined) && (db[llaves[i]]).report_date != "") {
			// Initialize variables
			var date = new Date(db[llaves[i]]["report_date"]);
			var mes = date.getMonth();
			var anio = date.getFullYear();
			var fecha = anio + mes * 0.01;
			var condado = db[llaves[i]].country.toLowerCase();
			var tipo = db[llaves[i]].cod.toLowerCase();
			// Filter males and females
			if (db[llaves[i]].gender == "male") {
				males++;
				filler(condado, placesmC, placesm);
				filler(tipo, tipomC, tipom)
				datador(fecha, datesm);
			}			
			if (db[llaves[i]].gender == "female") {
				females++;
				filler(condado, placesfC, placesf);
				filler(tipo, tipofC, tipof);
				datador(fecha, datesf);			
			}
			
			filler(condado, placestC, placest);
			filler(tipo, tipotC, tipot);
			datador(fecha, datest);
		}
	}
}

// Building some data structures
function builder(array1, array2, array1C, array2C, array) {
	var table = [['gender','male','female']];
	for (var k = 0; k < (array.length + 1); k++) {
		var temp = [];
		temp.push(array[k]);
		temp.push(0);
		temp.push(0);
		for (var i = 0; i < array1.length; i++) {
			if (array[k] == array1[i]) {
				temp[1] = array1C[i];
			}
		}
		for (var j = 0; j < array2.length; j++) {
			if (array[k] == array2[j]) {
				temp[2] = array2C[j];
			}
		}
		table.push(temp);
	}		
	return table;
}

// d3.js graphics
function doubleBarGraph(datos, title) {

	var margin = {top: 10, right: 10, bottom: 100, left: 30},
	width = 600 - margin.left - margin.right,
	height = 450 - margin.top - margin.bottom;

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

	document.getElementById('stats').innerHTML = "<p style='font: 20 px; font-family: sans-serif'><br>" + title + "</p>";

	var svg = d3.select("div#stats").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var generosG = ['male','female'];

	x0.domain(JSONtoArray(datos,'nombre'));
	x1.domain(generosG).rangeRoundBands([0, x0.rangeBand()]);
	y.domain([0, d3.max(datos, function(d) { return d3.max(d.genero, function(d) { return d.value; }); })]);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.selectAll("text")  
		    .style("text-anchor", "end")
		    .attr("dx", "-.8em")
		    .attr("dy", ".15em")
		    .attr("transform", "rotate(-45)");

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
		.data(generosG.slice().reverse())
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
function trendsGraph(datos, title, place) {
    var margin = {top: 10, right: 60, bottom: 100, left: 30},
        width = 600 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

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

/* 
Anatomy of the JSON object:
data - {
	nombre: "county",
	male: 123,
	female: 456,
	genero: [
		{
			name: "male",
			value: 123
		},
		{
			name: "female",
			value: 456
		}
	]
}
*/

function toJSON(ref0, ref1, ref2, cont1, cont2) {
	var jason = [];
	for (var i = 0; i < ref0.length; i++) {
		if (checkArray(ref0[i], ref1) || checkArray(ref0[i], ref2)) {
			var mf = [0,0];
			for (var j = 0; j < ref1.length; j++) {
				if (ref0[i] == ref1[j]) {
					mf[0] = cont1[j];
				}
			}
			for (var k = 0; k < ref2.length; k++) {
				if (ref0[i] == ref2[k]) {
					mf[1] = cont2[k];
				}
			}
			jason.push({'nombre': ref0[i], 'male': mf[0], 'female': mf[1], 'genero': [{'name': 'male', 'value': mf[0]}, {'name': 'female', 'value': mf[1]}] });
		}
	}
	return jason;
}

function createDropDown(id, opts) {
	var dropDown = document.createElement("select");
	dropDown.id = id;
	for (var i = 0; i < opts.length; i++) {
		opt = new Option();
		opt.value = i;
		opt.text = opts[i];
		dropDown.options.add(opt);
	}
	return dropDown;
}

// Activates general graphics
function generals() {
	var barra = document.getElementById('controls');
	var img = document.getElementById('stats');

	barra.innerHTML = "";
	var drop = createDropDown('gral', ['Places','Death Causes']);

	drop.onchange = function (nada) {

		if (drop.selectedIndex == 0) {
			jason = toJSON(placest, placesm, placesf, placesmC, placesfC);
		}
		if (drop.selectedIndex == 1) {
			jason = toJSON(tipot, tipom, tipof, tipomC, tipofC);
		}

		img.innerHTML = "";
		doubleBarGraph(jason, 'Deaths across the border.');
	}

	barra.appendChild(drop);
	jason = toJSON(placest, placesm, placesf, placesmC, placesfC);
	img.innerHTML = "";
	doubleBarGraph(jason, 'Deaths across the border.');
}

// Activates special graphics
function specials() {
	document.getElementById('stats').innerHTML = "<p style='font: 20 px; font-family: sans-serif'><br>Under construction ...</p>";
}

$.ajax({
	url:'lib/db.json',
	dataType:'json',
	xhrFields: {
		withCredentials: false
	},
	async: false,
	type:'GET',
	success:function(data){
		// Extract info
		database = data;
		// Let's do some magic
		datesInitializer();
		datesGenerator();
		total = Object.keys(database).length;

		// Extracting data one item at a time
		extractor(database);

		// Building tree
		treeSeed();
		waterTheTree(database);
	}
});