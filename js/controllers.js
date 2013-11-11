'use strict';

/* Controllers */

function getTimestamp(str) {
  var d = str.match(/\d+/g); // extract date parts
  return +new Date(d[0],d[1],d[2]);
}

var immigraphicsControllers = angular.module('immigraphicsControllers',[]);

immigraphicsControllers.controller('NavCtrl',
  ['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {

  $scope.user = Auth.user;
  $scope.userRoles = Auth.userRoles;
  $scope.accessLevels = Auth.accessLevels;

  $scope.logout = function() {
    Auth.logout(function() {
      $location.path('/login');
    }, function() {
      $rootScope.error = "Failed to logout";
    });
  };
}]);

immigraphicsControllers.controller('LoginCtrl',
  ['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

  $scope.rememberme = true;
  $scope.login = function() {
    Auth.login({
      username: $scope.username,
      password: CryptoJS.MD5($scope.password).toString(),
      grant_type: "user_credentials"
    },
    function(res) {
      $location.path('/');
    },
    function(err) {
      $rootScope.error = "Failed to login";
      alert("Failed to login");
    });
  };
}]);

immigraphicsControllers.controller('CreateCtrl',
  ['$rootScope', '$http', '$scope', '$location', '$window', 'Auth', function($rootScope, $http, $scope, $location, $window, Auth) {

  $http.get('json/states.json').success(function(data) { $scope.states = data; });

  $scope.register = function() {
    if($scope.password!=$scope.password2) {
      alert('Password does not match the confirmation password.')
    } else {
      Auth.register({
        username: $scope.username,
        password: CryptoJS.MD5($scope.password).toString(),
        profession: $scope.profession,
        location_authority: '',
        country: '',
        admn_lvl_1: $scope.state,
        admn_lvl_2: '',
        locality: '',
        sublocality: '',
        email: $scope.email
      },
      function(res) {
        $location.path('/create-user');
      },
      function(err) {
        $rootScope.error = "Failed to create user";
        alert("Failed to create the user");
      });
    }
  };
}]);

immigraphicsControllers.controller('CaseCtrl',
  ['$rootScope', '$http', '$scope', '$location', '$window', 'Auth', function($rootScope, $http, $scope, $location, $window, Auth) {

  $http.get('json/countries.json').success(function(data) { $scope.countries = data; });
  $scope.create = function() {
    Auth.create({
      ext_id: $scope.extId,
      name: $scope.name,
      gender: $scope.gender,
      report_date: getTimestamp($scope.reportDate),
      cod: $scope.cod,
      ome_cod: $scope.OMEcod,
      rough_precision: $scope.locationP,
      country: $scope.country,
      lat: $scope.lat,
      lng: $scope.lng,
      admn_lvl_1: '',
      admn_lvl_2: '',
      locality: $scope.location,
      sublocality: ''
    },
    function(res) {
      $location.path('/submit-case');
    },
    function(err) {
      $rootScope.error = "Failed to create case";
      alert("Failed to create case");
    });
  };
}]);

immigraphicsControllers.controller('StatCtrl',
  ['$scope','$http', function($scope,$http){
    $scope.Title = "Statistics";
  }]);

immigraphicsControllers.controller('SearchCtrl',
  ['$rootScope', '$http', '$scope', '$location', '$window', 'Auth', function($rootScope, $http, $scope, $location, $window, Auth){
  $scope.Title = "Search";
  var oldMarkers = [];

  $http.get('json/countries.json').success(function(data) { $scope.countries = data; });
  $scope.search = function() {
    Auth.search({
      name: $scope.name,
      gender: $scope.gender,
      cod: $scope.cod,
      country: $scope.country,
      limit: 200
    },
    function(res) {
      $location.path('/search');
      //console.log(res);
      if(oldMarkers && oldMarkers.length !== 0){
        for(var i = 0; i < oldMarkers.length; ++i){
          oldMarkers[i].setMap(null);
        }
      }

      var cont = 0;
      var currentInfoWindow = null;
      var fullBounds = new google.maps.LatLngBounds();

      $.each(res, function(i) {
        cont++;
        var point = new google.maps.LatLng(this.lat, this.lng);
        fullBounds.extend(point);
        var marker = new google.maps.Marker({
          position: point,
          map: map,
          title: this.name
        });
        marker.info = new google.maps.InfoWindow({
          content: '<b>Case ' + this.ext_id + '</b><br>'
            + this.name + ', ' + this.gender + '<br><br>'
            + '<b>Reporting Date:</b> '+  this.report_date + '<br>'
            + '<b>Country:</b> ' + this.country + '<br>'
            + '<b>Precision:</b> ' + this.rough_precision + '<br>'
            + '<b>Cause of Death:</b> ' + this.cod + '<br>'
            + '<b>Description:</b> ' + this.omd_cod + '<br>'
        });

        google.maps.event.addListener(marker, 'click', function() {
          if (currentInfoWindow != null) {
            currentInfoWindow.close();
          }
          marker.info.open(map, marker);
          currentInfoWindow = marker.info;
        });
        oldMarkers.push( marker );
      });

      if (cont != 0) map.fitBounds(fullBounds);
    },
    function(err) {
      $rootScope.error = "";
      alert("Can not contact the server, try again later.");
    });
  };
}]);

immigraphicsControllers.controller('StatCtrl',
  ['$rootScope', '$http', '$scope', '$location', '$window', 'Auth', function($rootScope, $http, $scope, $location, $window, Auth){
  $scope.Title = "Stats";


  $http.get('http://safetrails.herokuapp.com/index.php/cases', { params: {limit: 3000 }, cache: true }).success(function(data) {
    $('#loading-data').hide();
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
  }).error();
}]);
