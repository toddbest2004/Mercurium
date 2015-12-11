var app = angular.module('GameApp', ['GameCtrls','ngRoute'])
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
$routeProvider
.when('/', {
	templateUrl: 'app/views/game.html'
})
.otherwise({
	templateUrl: 'app/views/404.html'
})	

$locationProvider.html5Mode(true)
}])