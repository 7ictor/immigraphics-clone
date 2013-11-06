'use strict';

/* App Module */

var emmigraphics = angular.module('emmigraphics', [
  'ngRoute',
  'emmigraphicsControllers'
]);

emmigraphics.config(['$routeProvider','$httpProvider',
  function($routeProvider,$httpProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/login.html',
        controller: 'mainController'
      }).
      when('/home', {
        templateUrl: 'partials/login.html',
        controller: 'mainController'
      }).
      when('/create', {
        templateUrl: 'partials/create_user.html',
        controller: 'createUserController'
      }).      
      when('/submit', {
        templateUrl: 'partials/submit_case.html',
        controller: 'submitController'
      }).
      when('/search', {
        templateUrl: 'partials/search.html',
        controller: 'searchController'
      }).          
      when('/statistics', {
        templateUrl: 'partials/statistics.html',
        controller: 'statisticsController'
      }).               
      otherwise({
        redirectTo: '/home'
      });

      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.post['Content-type'];
      delete $httpProvider.defaults.headers.common["X-Requested-With"];


  }]);


