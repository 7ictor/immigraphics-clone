'use strict';

/* Controllers */

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
    });
  };
}]);

/*immigraphicsControllers.controller('mainController',['$scope','$http',
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


immigraphicsControllers.controller('createUserController',['$scope','$http',
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
/*        $http({
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

immigraphicsControllers.controller('submitController',['$scope','$http',
  function submitController($scope,$http){
    $scope.Title = "Welcome, sumbit a case";
    $http.get('json/countries.json').success(function(data) {
        $scope.countries = data;
      });

  }]);

immigraphicsControllers.controller('statisticsController',['$scope','$http',
  function statisticsController($scope,$http){
    $scope.Title = "Statistics";


  }]);


immigraphicsControllers.controller('searchController',['$scope','$http',
  function searchController($scope,$http){
    $scope.Title = "Search";


  }]);

*/
