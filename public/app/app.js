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