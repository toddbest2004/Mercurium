var app = angular.module('GameApp', ['GameCtrls','ngRoute'])
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
$routeProvider
.when('/showgame/:id', {
	templateUrl: 'app/views/game.html'
})
.when('/profile', {
	templateUrl: 'app/views/profile.html'
})
.when('/', {
	templateUrl: 'app/views/index.html'
})
.otherwise({
	templateUrl: 'app/views/404.html'
})	

$locationProvider.html5Mode(true)
}]).directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});

//right click directive taken from http://jsfiddle.net/bcaudan/tzqns/
//