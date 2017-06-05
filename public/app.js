console.log('app.js');

var app = angular.module('MyApp', []);

if(window.location.origin == "http://localhost:8000") {
  DB_URL = "http://localhost:3000";
}
else {
  DB_URL = "https://pizzaappapi.herokuapp.com";
}

app.controller('mainController', ['$http', function($http){
    this.url = DB_URL;
    this.user = {};
    this.message = "angular works!";
    this.selected_partial = 'index';
    this.review = ""
    this.allTheStars = 0;
    this.rating = 0;
    this.navshow = false;
    this.reloadPage = function(){
        $window.location.reload();
    }

    var controller = this;

    this.login = function(userPass) {

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
            console.log(this.user);
            localStorage.setItem('token', JSON.stringify(result.data.token));
            controller.navshow = true;
        }.bind(this));

    };

    this.signup = function(userPass) {
        console.log(userPass);
        $http({
            method: 'POST',
            url: DB_URL + '/users',
            data: { user: { username: userPass.username, password: userPass.password }},
        }).then(function(result) {
            this.getRestaurants();
            console.log(result);
            if (result.data.status == 401) {
                this.error = "Unauthorized";
            } else {
                this.selected_partial = 'index';

            }
            this.user = result.data.user;
            console.log(this.user);
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
            url: DB_URL + '/users/restaurants'
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

    this.addReview = function(restaurant_id,userid){
        console.log(userid);
    $http({
        method:"POST",
        url: DB_URL + '/users/restaurants/' + restaurant_id + '/reviews',
        data: {
            content: controller.createreview.content,
            restaurant_id: restaurant_id,
            user_id: userid,
            stars: controller.createreview.stars
        },
        headers: {
            Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
        }
    }).then(function(response){//success
      //this also might be a set to the userid so we probably can get rid of one or the other
            controller.allTheStars = 0;
            controller.rating = 0;
            controller.id = response.data.id;
            console.log(response);
            controller.getSpecificRestaurant(restaurant_id);
            controller.averageStars(restaurant_id)
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

        controller.reviews = result.data

        console.log(controller.reviews);
        controller.selected_partial = 'restaurantshowpage'
        for(i=0; i < controller.reviews.length; i++){
            controller.allTheStars = controller.allTheStars + controller.reviews[i].stars;
            console.log(controller.reviews[i].stars);
            console.log(controller.allTheStars);
        }
        controller.rating = controller.allTheStars / controller.reviews.length;
        console.log(controller.allTheStars);
        console.log(controller.rating);
        controller.averageStars(id);
        controller.rating = 0;

        });
    };

    this.averageStars = function(id) {
        $http({
            method: 'PUT',
            url: DB_URL + '/users/restaurants/' + id,
            data: {
                avgstars: controller.rating
            }
        }).then(function(result){
            console.log(result);
            console.log(controller);
        })
    };

    this.getAllReviewsRefresh = function(id) {
    $http({
        method: 'GET',
        url: DB_URL + '/users/restaurants/' + id + '/reviews',
    }).then(function(result){

        controller.reviews = result.data

        });
    };

    this.removeReview = function(restaurant_id, review_id){
        $http({
            method: 'DELETE',
            url: DB_URL + '/users/restaurants/' + restaurant_id + '/reviews/' + review_id,
        }).then(function(result){
            console.log('deleting');
            controller.rating = 0;
            controller.allTheStars = 0;
            controller.getAllReviewsRefresh(restaurant_id);
            controller.getSpecificRestaurant(restaurant_id);
            controller.getAllReviews(restaurant_id)
            controller.getSpecificRestaurant(restaurant_id);


        })
    };







}]);
