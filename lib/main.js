var borderLat = 30.600094;
var borderLng = -105.076675;
var directionsDisplay;
var map;
var start;
var latLongMarker;
var geocoder;
var infowindow = new google.maps.InfoWindow();
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
    map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
    directionsDisplay.setMap(map);


    geocoder = new google.maps.Geocoder();
    latLongMarker = new google.maps.Marker(
    {
          map:map,
          title: 'location'
    });

    google.maps.event.addListener(map, "rightclick", function(event) {
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
        // populate yor box/field with lat, lng
        $("#lat").val(lat);
        $("#long").val(lng);
        var latlng = new google.maps.LatLng(lat, lng);

        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results[1]) {
                //map.setZoom(11);
                latLongMarker.setPosition(latlng);
                infowindow.setContent(results[1].formatted_address);
                $("#location").val(results[1].formatted_address);
                infowindow.open(map, latLongMarker);
              } else {
                alert('No results found');
              }
            } else {
              alert('Geocoder failed due to: ' + status);
            }
          });

    });


}

$(function(){
    initialize(borderLat, borderLng);    
});
