angular.module('services').service('NomService', function($http) {
	this.userConnect = (email,mdp) => {
		return $http.get('http://127.0.0.1:3000/users?email='+email+'@gmail.com&pass='+mdp+'');
	};
	this.userTokenAdd = (id,add) => {
		return $http.patch('http://127.0.0.1:3000/users/'+ id +'', add);
	};
	this.verifToken = (id,token) => {
		return $http.get('http://127.0.0.1:3000/users?id='+ id +'&tokenSecure='+ token +'');
	};
	
});