'use strict';

/* Controllers */

var emmigraphicsControllers = angular.module('emmigraphicsControllers',[]);

emmigraphicsControllers.controller('mainController',['$scope','$http',
	function MainController($scope,$http){


		$scope.Title = "login";
		$http.get('json/states.json').success(function(data) {
	      $scope.states = data;
	      console.log(data);

	    });
	}]);

emmigraphicsControllers.controller('submitController',['$scope','$http',
	function MainController($scope,$http){
		$scope.Title = "Welcome, sumbit a case";
		$http.get('json/countries.json').success(function(data) {
	      $scope.countries = data;
	      console.log(data);
	    });

	}]);

emmigraphicsControllers.controller('statisticsController',['$scope','$http',
	function MainController($scope,$http){
		$scope.Title = "Statistics";


	}]);
