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

/*
Anatomy of the data tree
all - {
	males: [
		[
			date,
			[
				{place: 123, place: 456},
				{death_cause: 147, death_cause: 258}
			]
		]
	]
	female: -- same --
	totals: -- same --
}

*/
var all = null;

// Create a tree
function datesGenerator() {
	all = {"males":[], "female":[], "totals":[]};
	datum = (new Date()).getFullYear() + 1;
	for (var i = 2000; i < datum; i++) {
		for (var j = 0; j < 12; j++) {
			all.males.push( [i + (j * 0.01), [0, 0]] );
			all.female.push( [i + (j * 0.01), [0, 0]] );
			all.totals.push( [i + (j * 0.01), [0, 0]] );
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
	for (var i = 0; i < all.males.length; i++) {
		all.males[i][1][0] = arrayToDict(tipom);
		all.males[i][1][1] = arrayToDict(placesm);

		all.female[i][1][0] = arrayToDict(tipof);
		all.female[i][1][1] = arrayToDict(placesf);

		all.totals[i][1][0] = arrayToDict(tipot);
		all.totals[i][1][1] = arrayToDict(placest);
	}
}

// Making tree have leaves
function dataRestructure(item, gender) {
	datum = new Date(item.report_date);
	fecha = datum.getFullYear() + (datum.getMonth() * 0.01);
	for (var i = 0; i < all[gender].length; i++) {
		tot = item.cod;
		lan = item.country;
		if ( (fecha == all[gender][i][0]) && (tot !== undefined) ) {
			all[gender][i][1][0][tot.toLowerCase()] += 1;
		}
		if ( (fecha == all[gender][i][0]) && (lan !== undefined) ) {
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
	llaves = Object.keys(db);
	for (var i = 0; i < llaves.length; i++ ) {
		if ((db[llaves[i]].country !== undefined) && (db[llaves[i]]).report_date !== "") {
			// Initialize variables
			var date = new Date(db[llaves[i]].report_date);
			var mes = date.getMonth();
			var anio = date.getFullYear();
			var fecha = anio + mes * 0.01;
			var condado = db[llaves[i]].country.toLowerCase();
			var tipo = db[llaves[i]].cod.toLowerCase();
			// Filter males and females
			if (db[llaves[i]].gender == "male") {
				males++;
				filler(condado, placesmC, placesm);
				filler(tipo, tipomC, tipom);
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
	.rangeRoundBands([0, width], 0.1);

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
	.attr("width", width + margin.left + margin.right + 100)
	.attr("height", height + margin.top + margin.bottom + 50)
	.append("g")
	.attr("transform", "translate(" + (margin.left + 20) + "," + (margin.top - 10) + ")");

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

function splitSources(datos) {
	var llaves = Object.keys( datos[0] );
	var new_data = new Array(llaves.length - 1);
	for (var k = 1; k < llaves.length; k++) {
		var nline = [];
		for (var i = 0; i < datos.length; i++) {
			var ayer = new Date();
			var ano = Math.floor( datos[ i ][ llaves[0] ] );
			ayer.setFullYear( ano );
			ayer.setMonth( (datos[ i ][ llaves[0] ] - ano) * 100 );
			ayer.setDate(1);

			tmp = {};
			tmp[ llaves[0] ] = ayer;
			tmp[ llaves[k] ] = datos[ i ][ llaves[k] ];
			nline.push( tmp );
		}
		new_data[k - 1] = nline;
	}
	return new_data;
}

// MultiLine tendencies graphics function
function trendsGraph(datos, title) {

	var llaves = Object.keys(datos[0]);
	var maximo = 0;
	for (var i = 0; i < datos.length; i++) {
		for (var j = 1; j < llaves.length; j++) {
			if (datos[i][llaves[j]] > maximo) {
				maximo = datos[i][llaves[j]];
			}
		}
	}

	document.getElementById('stats').innerHTML = "<p style='font: 20 px; font-family: sans-serif'><br>" + title + "</p>";
	var color = ["#0000CC", "#CC0000"];
	var farben = d3.scale.ordinal().range(color);
	var sources = splitSources(datos);

	var margin = {top: 10, right: 60, bottom: 100, left: 30},
		width = 600 - margin.left - margin.right,
		height = 450 - margin.top - margin.bottom;

	var x = d3.time.scale()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var line = d3.svg.line()
		.x(function(d) { return x(d.dates); })
		.y(function(d) { return y(d.males); });

	var linie = d3.svg.line()
		.interpolate("basis")
		.x(function(d) { return x(d.dates); })
		.y(function(d) { return y(d.female); });

	var svg = d3.select("div#stats").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.attr("style", "background: white")
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	x.domain(d3.extent(sources[0], function(d) { return d.dates; }));
	y.domain([0, maximo]);

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

	svg.append("path")
		.datum(sources[0])
		.attr("class", "line")
		.attr("d", line)
		.style("stroke", color[0]);

	svg.append("path")
		.datum(sources[1])
		.attr("class", "line")
		.attr("d", linie)
		.style("stroke", color[1]);

	var legend = svg.selectAll(".legend")
		.data(['Males', 'Females'].slice())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
		.attr("x", width - 18)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", farben);

	legend.append("text")
		.attr("x", width - 24)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d; });

}

/*
Anatomy of the JSON_1 object:
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
Anatomy of the JSON_2 object:
data - [
	{Date: 15-9-2018,
	Field_1: 123,
	Field_2: 456,
	Field_3: 789,
	... },

	...
]
*/

function toJSON_1(ref0, ref1, ref2, cont1, cont2) {
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

function toJSON_2(min, max, field, category) {
	var jason = [];
	var opt = 0;
	if (field == 'country') {
		opt = 1;
	}
	if (field == 'cause') {
		opt = 0;
	}
	for (var i = 0; i < all.males.length; i++) {
		if ( ( Math.floor(all.males[i][0]) >= min ) && ( Math.floor(all.males[i][0]) <= max ) ) {
			jason.push( { 'dates' : all.males[i][0], 'males' : zero(all.males[i][1][opt][category]), 'female' : zero(all.female[i][1][opt][category]) } );
		}
	}
	return jason;
}

function zero(dato) {
	if (dato === undefined) {
		return 0;
	} else {
		return dato;
	}
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

		if (drop.selectedIndex === 0) {
			jason = toJSON_1(placest, placesm, placesf, placesmC, placesfC);
		}
		if (drop.selectedIndex == 1) {
			jason = toJSON_1(tipot, tipom, tipof, tipomC, tipofC);
		}

		img.innerHTML = "";
		doubleBarGraph(jason, 'Deaths across the border.');
	};

	barra.appendChild(drop);
	jason = toJSON_1(placest, placesm, placesf, placesmC, placesfC);
	img.innerHTML = "";
	doubleBarGraph(jason, 'Deaths across the border.');
}

// Activates special graphics
function specials() {
	var barra = document.getElementById('controls');
	var img = document.getElementById('stats');

	var limits = [[],[]];
	for (var i = 2000; i < (new Date()).getFullYear() + 1; i++) {
		if (i != (new Date()).getFullYear()) {
			limits[0].push(i);
		}
		if (i != 2000) {
			limits[1].push(i);
		}
	}

	barra.innerHTML = "";
	var mins = createDropDown('mindestend', limits[0]);
	var maxs = createDropDown('maximal', limits[1]);
	var drop = createDropDown('gral', ['Select an option ...','Places','Death Causes']);
	barra.appendChild(mins);
	barra.appendChild(maxs);

	drop.onchange = function (nada) {
		var listo = document.getElementById('opts');
		if ( listo != undefined ) {
			barra.removeChild(listo);
		}
		var opciones;
		var campo;
		var categ;
		if (drop.selectedIndex == 1) {
			opciones = createDropDown('opts', placest);
			campo = 'country';
			categ = placest;
		}
		if (drop.selectedIndex == 2) {
			opciones = createDropDown('opts', tipot);
			campo = 'cause';
			categ = tipot;
		}
		opciones.onchange = function (nothing) {
			img.innerHTML = "";
			var jason = toJSON_2(limits[0][mins.selectedIndex], limits[1][maxs.selectedIndex], campo, categ[opciones.selectedIndex]);
			trendsGraph(jason, 'Death tendencies across time.');
		};
		barra.appendChild(opciones);
	};
	barra.appendChild(drop);

}
