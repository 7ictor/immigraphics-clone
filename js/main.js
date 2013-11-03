var directionsDisplay;
var map;
var start;

// Initialize the view for the actual address of the client based on lat lng.
function initialize(lat, lng) {
    google.maps.visualRefresh = true;
    start = new google.maps.LatLng(lat, lng);
    directionsDisplay = new google.maps.DirectionsRenderer();
    var mapOptions = {
        zoom: 6,
        center: start,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
    directionsDisplay.setMap(map);
    var marker = new google.maps.Marker({
        position: map.getCenter(),
        map: map,
        title: 'Your Address'
    });
}

// Row builder for the JSON data response
function rowBuilder(data, i){

}

// Perform the Ajax request with the parameters
function ajax_request(parameters) {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        url: '',
        data: parameters,
        success: function(data) {
            initialize(data.location.lat, data.location.lng);
            $.each(data.results, function(i) {
                $(rowBuilder(this, i)).appendTo("#results tbody")
            });
        },
        error: function(error) {
            $("#request-error").show().html("<strong>Sorry!</strong> The request could not be processed due to a server error.");
        }
    });
}

$(function() {
    initialize(30.600094,-105.076675);
    $("form#myform").submit(function() {
        $("#results tbody").find("tr").remove();
        var mydata = $("form#myform").serialize();
        ajax_request(mydata);

        return false;
    });
});
