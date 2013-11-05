'use strict';

/* Controllers */

var emmigraphicsControllers = angular.module('emmigraphicsControllers',[]);

emmigraphicsControllers.controller('mainController',['$scope','$http',
	function MainController($scope,$http){
		$scope.Title = "Welcome";
		$http.get('json/countries.json').success(function(data) {
			console.log(data);
	      $scope.countries = data;
	    });
	}]);

emmigraphicsControllers.controller('submitController',['$scope','$http',
	function MainController($scope,$http){
		$scope.Title = "Welcome, sumit a case";
		$http.get('json/states.json').success(function(data) {
			console.log(data);
	      $scope.states = data;
	    });

	}]);

emmigraphicsControllers.controller('statisticsController',['$scope','$http',
	function MainController($scope,$http){
		$scope.Title = "Statistics";


	}]);
