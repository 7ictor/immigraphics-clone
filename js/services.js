'use strict';

/* Services */

var immigraphicsServices = angular.module('immigraphicsServices',[]);

immigraphicsServices.factory('Auth',
  function($http, $cookieStore){

  var accessLevels = routingConfig.accessLevels
    , userRoles = routingConfig.userRoles
    , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };

  $cookieStore.remove('user');

  function changeUser(user) {
    _.extend(currentUser, user);
  };

  return {
    authorize: function(accessLevel, role) {
      if(role === undefined)
      {
        role = currentUser.role;
      }
      return accessLevel.bitMask & role.bitMask;
    },
    isLoggedIn: function(user) {
      if(user === undefined)
        user = currentUser;
      return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
    },
    register: function(user, success, error) {
      var token_oauth = $cookieStore.get('token');
      $http.post('http://safetrails.herokuapp.com/index.php/u/save', user, {headers: {'Authorization_oauth_token': token_oauth}}).success(function(res) {
        success(res);
        alert(res.message);
      }).error(error);
    },
    login: function(user, success, error) {
      $http.post('http://safetrails.herokuapp.com/index.php/authorize', user).success(function(user){
        changeUser(user);
        success(user);
        $cookieStore.put('token', user.access_token);
      }).error(error);
    },
    logout: function(success, error) {
      //$http.post('/logout').success(function(){
        changeUser({
          username: '',
          role: userRoles.public
        });
        success();
      //}).error(error);
    },
    create: function(c, success, error) {
      var token_oauth = $cookieStore.get('token');
      $http.post('http://safetrails.herokuapp.com/index.php/cases', c, {headers: {'Authorization_oauth_token': token_oauth}}).success(function(res) {
        success(res);
        alert(res.message);
      }).error(error);
    },
    search: function(query, success, error) {
      $http.get('http://safetrails.herokuapp.com/index.php/cases', { params: query }).success(function(res) {
        success(res);
      }).error(error);
    },
    accessLevels: accessLevels,
    userRoles: userRoles,
    user: currentUser
  };
});
