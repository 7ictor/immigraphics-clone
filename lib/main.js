var borderLat = 30.600094; // US-Mexico border lat
var borderLng = -105.076675; // US-Mexico border lng
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
    var latInput = $("#lat");
    var lngInput = $("#long");
    latInput.val(lat);
    lngInput.val(lng);
    latInput.trigger("input");
    lngInput.trigger("input");
    var latlng = new google.maps.LatLng(lat, lng);

    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          latLongMarker.setPosition(latlng);
          infowindow.setContent(results[1].formatted_address);
          var locationInput = $("#location");
          locationInput.val(results[1].formatted_address);
          locationInput.trigger("input");
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
