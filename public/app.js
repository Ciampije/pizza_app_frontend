console.log('app.js');

var app = angular.module('MyApp', []);

if(window.location.origin == "http://localhost:8000") {
  DB_URL = "http://localhost:3000";
}
else {
  DB_URL = "https://pizzappapi.herokuapp.com";
}

app.controller('mainController', ['$http', function($http){
    this.url = DB_URL;
    this.user = {};
    this.message = "angular works!";
    this.selected_partial = 'index';
    this.review = ""
    this.reloadPage = function(){
        $window.location.reload();
    }

    var controller = this;

    this.login = function(userPass) {
        console.log(userPass);
        $http({
            method: 'POST',
            url: DB_URL + '/users/login',
            data: { user: { username: userPass.username, password: userPass.password }},
        }).then(function(result) {
            this.getRestaurants();
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
            url: DB_URL + '/users',
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
            url: 'https://pizzaappapi.herokuapp.com/users/restaurants',
            headers: {
                Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
            }
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
            url: DB_URL + '/users/restaurants/' + id
        }).then(function(result){
            this.specificRestaurant = result.data
            console.log(controller.specificRestaurant);
            controller.selected_partial = 'restaurantshowpage';
        }.bind(this));
    };

    this.addReview = function(restaurant_id){
    $http({
        method:"POST",
        url: DB_URL + '/users/restaurants/' + restaurant_id + '/reviews',
        data: this.createreview,
        headers: {
            Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
        }
    }).then(function(response){//success
      //this also might be a set to the userid so we probably can get rid of one or the other
            controller.id = response.data.id;
            console.log(response);
            controller.getAllReviews(restaurant_id)
        },
      function(response) {//failure
        console.log(response);
      });
};

    this.getAllReviews = function(id) {
    $http({
        method: 'GET',
        url: DB_URL + '/users/restaurants/' + id + '/reviews',
    }).then(function(result){
        console.log(result);
        controller.reviews = result.data
        console.log("===============");
        console.log(controller.reviews);
        controller.selected_partial = 'restaurantshowpage'
    });
    };

    this.removeReview = function(restaurant_id, review_id){
        $http({
            method: 'DELETE',
            url: DB_URL + '/users/restaurants/' + restaurant_id + '/reviews/' + review_id,
        }).then(function(result){
            console.log('deleting');
            controller.getAllReviews();
        })
    }

    this.getRestaurants();


}]);
