'use strict';

/* Controllers */

var emmigraphicsControllers = angular.module('emmigraphicsControllers',[]);

emmigraphicsControllers.controller('mainController',['$scope','$http',
	function MainController($scope,$http){
	    $scope.user={
	    	name:'',
	    	password:''
	    };
		$scope.Title = "login";
		// login function
		$scope.login = function(){
			var _username = $scope.user.name;
			var _password = $scope.user.password;
			var _passwordEnc = CryptoJS.MD5(_password).toString();
			console.log(_username+": "+_passwordEnc);
			$http({
				method: 'POST',
				url: 'http://safetrails.herokuapp.com/u/auth.php',
				data: {
					username:_username,
					password:_passwordEnc
				},
				 withCredentials: false
			}).success(function(data){
				console.log(data);
				if(data.response=="success"){
		   			console.log("entro");
		   			window.location.href="#/submit"
		   		}else{
		   			$(".message").html("Wrong username or password, please try again");
		   			console.log("error");
		   		}
			});
			
		}

	}]);

emmigraphicsControllers.controller('submitController',['$scope','$http',
	function submitController($scope,$http){
		$scope.Title = "Welcome, sumbit a case";
		$http.get('json/countries.json').success(function(data) {
	      $scope.countries = data;
	      console.log(data);
	    });

	}]);

emmigraphicsControllers.controller('statisticsController',['$scope','$http',
	function statisticsController($scope,$http){
		$scope.Title = "Statistics";


	}]);


emmigraphicsControllers.controller('searchController',['$scope','$http',
	function searchController($scope,$http){
		$scope.Title = "Search";


	}]);


emmigraphicsControllers.controller('createUserController',['$scope','$http',
	function createUserController($scope,$http){
		$scope.Title = "Search";
		$http.get('json/states.json').success(function(data) {
	      $scope.states = data;
	    });

		$scope.createUser = function(){
			
			var user = $scope.user;
			var defaultUser={
					   username:"",
					   password:"",
					   profession:"",
					   state:"",
					   county:"county_test",
					   email:""
					};
			console.log(user.password+" : "+user.password2)
			if(user.password!=user.password2){
				alert("Passwords do not match");
		    	return
			}else{
				user.password = CryptoJS.MD5(user.password).toString();
				$http({
					method: 'POST',
					url: 'http://safetrails.herokuapp.com/u/save.php',
					data: user,
					withCredentials: false
				}).success(function(data){
					console.log(data);
					if(data.response=="success"){
			   			console.log("entro");
			   			$(".message").html("User created");
			   		}else{
			   			$(".message").html("Something went Wrong");
			   			console.log("error");
			   		}
				});
			}
			$scope.user=defaultUser;

		}

	}]);