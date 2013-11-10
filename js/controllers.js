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
  ['$scope','$http', function($scope,$http){
    $scope.Title = "Search";
  }]);
