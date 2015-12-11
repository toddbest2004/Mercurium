angular.module('GameCtrls', [])
.controller('GameCtrl', ['$scope', '$http', function($scope, $http) {
  var textures = ['highlight.png','sand.png', 'grass.png']

  $scope.game = {}

  $scope.getGame = function(){
    var req = {
      url: "http://localhost:3000/game/",
      method: 'GET',
      params: {
      }
    }
    $http(req).then(function success(res) {
      $scope.game = res.data
    }, function error(res) {
      console.log(res)
    });
  }
  $scope.click = function(tile){
    $scope.clearSelected()
    tile.selected=!tile.selected
  }
  $scope.hoverIn = function(tile){
  }
  $scope.hoverOut = function(tile){
  }

  $scope.paths = [{x:1}, {x:2}]

  $scope.getImage = function(tile){
    if(tile.selected){
      return 'images/'+textures[0]
    }
    if(tile.texture){
      return 'images/'+textures[tile.texture]
    }
    return 'images/tile.png'
  }
  $scope.clearSelected = function(){
    $scope.game.map.forEach(function(tile){
      tile.selected=false
    })
  }
  $scope.getTileX = function(tile){
    var x = tile.x+tile.y/2
    return x*92
  }
  $scope.getTileY = function(tile){
    return tile.y*80
  }

  $scope.getGame()
}])