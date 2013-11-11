'use strict';

/* App Module */

var immigraphicsApp = angular.module('immigraphicsApp', [
  'immigraphicsControllers',
  'immigraphicsDirectives',
  'immigraphicsServices',
  'ngRoute',
  'ngCookies'
]);

immigraphicsApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {

  $httpProvider.defaults.withCredentials = false;
  var access = routingConfig.accessLevels;

  $routeProvider.
    when('/', {
      templateUrl:    'partials/home.html',
      controller:     'LoginCtrl',
      access:         access.user
    }).
    when('/login', {
      templateUrl:    'partials/login.html',
      controller:     'LoginCtrl',
      access:         access.anon
    }).
    when('/create-user', {
      templateUrl:    'partials/create_user.html',
      controller:     'CreateCtrl',
      access:         access.admin
    }).
    when('/submit-case', {
      templateUrl:    'partials/submit_case.html',
      controller:     'CaseCtrl',
      access:         access.user
    }).
    when('/search', {
      templateUrl:    'partials/search.html',
      controller:     'SearchCtrl',
      access:         access.public
    }).
    otherwise({redirectTo:'/'});

  $locationProvider.html5Mode(false);

  var interceptor = ['$location', '$q', function($location, $q) {
    function success(response) {
      return response;
    }

    function error(response) {
      if(response.status === 401) {
        $location.path('/login');
        return $q.reject(response);
      }
      else {
        return $q.reject(response);
      }
    }

    return function(promise) {
      return promise.then(success, error);
    }
  }];

  $httpProvider.responseInterceptors.push(interceptor);

}]);

immigraphicsApp.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {

  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    $rootScope.error = null;
    if (!Auth.authorize(next.access)) {
      if(Auth.isLoggedIn()) $location.path('/');
      else                  $location.path('/login');
    }
  });
}]);
