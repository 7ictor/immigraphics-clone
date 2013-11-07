function saveCase(){
	_extid = $("#extId").val();
	_name = $("#name").val();
	_gender= $("#gender option:selected").val();
	_reportDate = getTimestamp($("#reportDate").val());
	_cod = $("#cod option:selected").val();
	_place = $("#location").val();
	_precision = $("#locationP").val();
	_langManagement = $("#OMEcod").val();
	_country = $("#country option:selected").text();
	_corridor = $("#corridor").val();
	_lat = $("#lat").val();
	_long = $("#long").val();


		$.ajax({
				url: "http://safetrails.herokuapp.com/cases/save.php",
				   type: "POST",
				   data:{
					    extid:_extid,
						name:_name,
						gender:_gender,
						reportDate:_reportDate,
						cod:_cod,
						place:_place,
						precision:_precision,
						langManagement:_langManagement,
						country:_country,
						corridor:_corridor,
						lat:_lat,
						long: _long
					},
				   xhrFields: {
				      withCredentials: false
				   },
				   crossDomain: true,
				   success: function(data){
				   		console.log(data);
				   		a = $.parseJSON(data);
				   		console.log(a);
				   		if(a.response=="success"){
				   			console.log("entro");
				   			$('#formLogin').trigger("reset");
				   			    latLongMarker = new google.maps.Marker(
								    {
								    	map:map,
								    	title: 'location'
								    }
						    	);
				   			alert("Case created");
				   		}else{
				   			alert("error creating user");
				   		}
				   }
				});
	}

function getTimestamp(str) {
	  var d = str.match(/\d+/g); // extract date parts
  		return +new Date(d[0],d[1],d[2]);

}
