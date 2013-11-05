'use strict';

/* App Module */

var emmigraphics = angular.module('emmigraphics', [
  'ngRoute',
  'emmigraphicsControllers'
]);

emmigraphics.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/login.html',
        controller: 'mainController'
      }).
      when('/home', {
        templateUrl: 'partials/login.html',
        controller: 'mainController'
      }).
      when('/submit', {
        templateUrl: 'partials/submit_case.html',
        controller: 'submitController'
      }).
      when('/statistics', {
        templateUrl: 'partials/statistics.html',
        controller: 'statisticsController'
      }).               
      otherwise({
        redirectTo: '/search'
      });
  }]);
