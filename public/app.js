console.log('app.js');

var app = angular.module('MyApp', []);

app.controller('mainController', ['$http', function($http){
    this.url = 'http://localhost:3000';
    this.user = {};
    this.message = "angular works!";
    var controller = this;

    this.login = function(userPass) {
        console.log(userPass);
        $http({
            method: 'POST',
            url: this.url + '/users/login',
            data: { user: { username: userPass.username, password: userPass.password }},
        }).then(function(result) {
            console.log(result);
            this.user = result.data.user;
            localStorage.setItem('token', JSON.stringify(result.data.token));
        }.bind(this));
    };

    this.getUsers = function() {
        $http({
            url: this.url + '/users',
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
            }
        }).then(function(result) {
            console.log(result);
            if (result.data.status == 401) {
                this.error = "Unauthorized";
            } else {
                this.users = result.data;
            }
        }.bind(this))
    };

    this.logout = function() {
        localStorage.clear('token');
        location.reload();
    }

    this.getRestaurants = function() {
        $http({
            method: 'GET',
            url: 'http://localhost:3000/users/restaurants'
        }).then(function(result){
            console.log(result);
            controller.restaurants = result.data;
            console.log(controller.restaurants);
        });
    };
    this.getRestaurants();
}]);
