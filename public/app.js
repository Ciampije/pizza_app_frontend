console.log('app.js');

var app = angular.module('MyApp', []);

app.controller('mainController', ['$http', function($http){
    this.url = 'http://localhost:3000';
    this.user = {};
    this.message = "angular works!";
    this.selected_partial = 'index';
    this.review = ""
    var controller = this;

    this.login = function(userPass) {
        console.log(userPass);
        $http({
            method: 'POST',
            url: this.url + '/users/login',
            data: { user: { username: userPass.username, password: userPass.password }},
        }).then(function(result) {
            console.log(result);
            if (result.data.status == 401) {
                this.error = "Unauthorized";
            } else {
                this.selected_partial = 'userindex';

            }
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
    this.getSpecificRestaurant = function(id) {
        this.restaurant_id = id;
        $http({
            method: 'GET',
            url: 'http://localhost:3000/users/restaurants/' + id
        }).then(function(result){
            this.specificRestaurant = result.data
            console.log(controller.specificRestaurant);
            controller.selected_partial = 'restaurantshowpage';
        }.bind(this));
    };

    this.addReview = function(review){
        console.log('hi');
    $http({
        method:"POST",
        url:'http://localhost:3000/users/restaurants/2/reviews',
        data: review.to_json,
        headers: {
            Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
        }
    }).then(function(response){//success
      //this also might be a set to the userid so we probably can get rid of one or the other
            controller.id = response.data.id;
            console.log(response);
        },
      function(response) {//failure
        console.log(response);
      });
};

    this.getRestaurants();
}]);
